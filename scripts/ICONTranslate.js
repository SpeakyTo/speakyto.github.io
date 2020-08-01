// EventLogs
const QuestionCreatedEvent = 'QuestionCreatedEvent(int)'
const AnswerCreatedEvent = 'AnswerCreatedEvent(int)'

class SpeakyTo {
    constructor(ancilia, scoreAddress) {
        this._ancilia = ancilia
        this._scoreAddress = scoreAddress
    }

    getQuestion(questionUid) {
        // Description: Get all question information by a question UID
        // questionUid: The question identifier
        // returns: A serialized Question dict object
        return this._ancilia.__callROTx(this._scoreAddress, 'get_question', {
            'question_uid': IconConverter.toHex(questionUid)
        })
    }

    getAnswer(answerUid) {
        // Description: Get all answer information by a answer ID
        // answerUid: The answer identifier
        // returns: A serialized Answer dict object
        return this._ancilia.__callROTx(this._scoreAddress, 'get_answer', {
            'answer_uid': IconConverter.toHex(answerUid)
        })
    }

    getQuestions(offset) {
        // Description: Get all questions from a given offset
        //              This API will return a maximum amount of 100 items
        //              Increment the offset value by 100 if you need more results
        //              The API will return a StopIteration exception if there is
        //              no more items at the given offset
        // offset: The list index offset (always increment 100 by 100 otherwise you may have weird results)
        // returns: A list of serialized Questions dict objects
        return this._ancilia.__callROTx(this._scoreAddress, 'get_questions', {
            'offset': IconConverter.toHex(offset)
        })
    }

    getAnswers(questionUid, offset) {
        // Description: Get all questions from a given offset for a specific question
        //              This API will return a maximum amount of 100 items
        //              Increment the offset value by 100 if you need more results
        //              The API will return a StopIteration exception if there is
        //              no more items at the given offset
        // questionUid: The question UID
        // offset: The list index offset (always increment 100 by 100 otherwise you may have weird results)
        // returns: A list of serialized Answer dict objects
        return this._ancilia.__callROTx(this._scoreAddress, 'get_answers', {
            'question_uid': questionUid,
            'offset': IconConverter.toHex(offset)
        })
    }

    createQuestionLevel1(data, from_language, to_language, icx_reward) {
        // Description: Creates a level 1 question
        // data: The question data (format: ? TBD)
        // from_language: The iso_639-1 code language of the "from" word
        // to_language: The iso_639-1 code language of the "to" word
        // icx_reward: Amount of ICX sent as a reward for the question
        // returns: The newly created question UID
        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'create_question_level1',
            IconConverter.toHex(this._ancilia.convertUnitToDecimals(icx_reward, 18)),
            {
                'data': data,
                'from_language': from_language,
                'to_language': to_language
            }
        ).then(async tx => {
            const txHash = tx['result']
            const txResult = await this._ancilia.__txResult(txHash)
            const eventLogs = txResult['eventLogs'][0]
            if (eventLogs['indexed'][0] !== QuestionCreatedEvent) {
                throw WrongEventSignature(eventLogs['indexed']);
            }
            const questionUid = parseInt(eventLogs['indexed'][1], 16)
            return questionUid
        })
    }

    answerQuestion(questionUid, data) {
        // Description: Answer to a question (of any level)
        // questionUid: The question UID
        // data: The answer data (format: ? TBD)
        // returns: The newly created answer UID

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'answer_question',
            0,
            {
                'question_uid': questionUid,
                'data': data,
            }
        ).then(async tx => {
            const txHash = tx['result']
            const txResult = await this._ancilia.__txResult(txHash)
            const eventLogs = txResult['eventLogs'][0]
            if (eventLogs['indexed'][0] !== AnswerCreatedEvent) {
                throw WrongEventSignature(eventLogs['indexed']);
            }
            const answerUid = parseInt(eventLogs['indexed'][1], 16)
            return answerUid
        })
    }

    selectAnswer(answerUid) {
        // Description: Select the answer as a valid answer for its associated question
        //              The reward (if any) will be sent to the user who posted this answer
        // answerUid: The answer UID
        // returns: None

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'select_answer',
            0,
            {
                'answer_uid': answerUid
            }
        )
    }

    cancelQuestion(questionUid) {
        // Description: Cancel a question (of any level), only works for the Question OP
        //              The reward should be refunded to OP if there is any
        //              It only works if there is no answer to the question
        // questionUid: The question UID
        // returns: None

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'cancel_question',
            0,
            {
                'question_uid': questionUid
            }
        )
    }
}