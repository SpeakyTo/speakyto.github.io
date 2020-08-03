// EventLogs
const QuestionCreatedEvent = 'QuestionCreatedEvent(int)'
const AnswerCreatedEvent = 'AnswerCreatedEvent(int)'
const UserAccountCreatedEvent = 'UserAccountCreatedEvent(int)'

class SpeakyTo {
    constructor(ancilia, scoreAddress) {
        this._ancilia = ancilia
        this._scoreAddress = scoreAddress
    }

    // -- Getters ---

    getQuestion(question_uid) {
        // Description: Get all question information by a question UID
        // question_uid: The question identifier
        // returns: A serialized Question dict object
        return this._ancilia.__callROTx(this._scoreAddress, 'get_question', {
            'question_uid': IconConverter.toHex(question_uid)
        })
    }

    getAnswer(answer_uid) {
        // Description: Get all answer information by a answer ID
        // answer_uid: The answer identifier
        // returns: A serialized Answer dict object
        return this._ancilia.__callROTx(this._scoreAddress, 'get_answer', {
            'answer_uid': IconConverter.toHex(answer_uid)
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

    getAnswers(question_uid, offset) {
        // Description: Get all questions from a given offset for a specific question
        //              This API will return a maximum amount of 100 items
        //              Increment the offset value by 100 if you need more results
        //              The API will return a StopIteration exception if there is
        //              no more items at the given offset
        // question_uid: The question UID
        // offset: The list index offset (always increment 100 by 100 otherwise you may have weird results)
        // returns: A list of serialized Answer dict objects
        return this._ancilia.__callROTx(this._scoreAddress, 'get_answers', {
            'question_uid': question_uid,
            'offset': IconConverter.toHex(offset)
        })
    }

    getSupportedLanguages() {
        // Description: Get the supported languages
        // returns: 
        return this._ancilia.__callROTx(this._scoreAddress, 'get_supported_languages')
    }

    // -- User APIs

    createUserAccount(avatar_uid, username) {
        // Description: Create a new user account
        // avatar_uid: The avatar ID
        // username: The account username
        // returns: The newly created user UID
        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'create_user_account',
            0,
            {
                'avatar_uid': avatar_uid,
                'username': username
            }
        ).then(async tx => {
            const txHash = tx['result']
            const eventLog = await this._ancilia.getEventLog(txHash, UserAccountCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    setUserAvatar(avatar_uid) {

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'set_user_avatar',
            0,
            {
                'avatar_uid': avatar_uid
            }
        )
    }

    setUserUsername(username) {

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'set_user_username',
            0,
            {
                'username': username
            }
        )
    }


    getUserLevel(user_uid) {
        // Description: Get the user level
        // user_uid: The user identifier
        // returns: The user level
        return this._ancilia.__callROTx(this._scoreAddress, 'get_user_level', {
            'user_uid': user_uid
        })
    }

    getUserAccount(user_uid) {
        // Description: Get the user account info
        // user_uid: The user identifier
        // returns: The user account
        return this._ancilia.__callROTx(this._scoreAddress, 'get_user_account', {
            'user_uid': user_uid
        })
    }

    getUserUid(user_address) {
        // Description: Get the user UID from his address
        // user_address: The user ICON address
        // returns: The SpeakyTo user UID
        return this._ancilia.__callROTx(this._scoreAddress, 'get_user_uid', {
            'user_address': user_address
        })
    }

    getUserExperience(user_uid) {
        // Description: Get the user experience
        // user_uid: The user identifier
        // returns: The user experience
        return this._ancilia.__callROTx(this._scoreAddress, 'get_user_experience', {
            'user_uid': user_uid
        })
    }

    // -- Create Questions APIs

    createQuestionLevel1(data, from_language, to_language, icx_reward) {
        // Description: Creates a level 1 question
        // data: The question data (format: word or sentence, max characters 50)
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
            const eventLog = await this._ancilia.getEventLog(txHash, QuestionCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    createQuestionLevel2(data, from_language, to_language, icx_reward) {
        // Description: Creates a level 2 question
        // data: The question data (format: word or sentence, max characters 200)
        // from_language: The iso_639-1 code language of the "from" word
        // to_language: The iso_639-1 code language of the "to" word
        // icx_reward: Amount of ICX sent as a reward for the question
        // returns: The newly created question UID
        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'create_question_level2',
            IconConverter.toHex(this._ancilia.convertUnitToDecimals(icx_reward, 18)),
            {
                'data': data,
                'from_language': from_language,
                'to_language': to_language
            }
        ).then(async tx => {
            const txHash = tx['result']
            const eventLog = await this._ancilia.getEventLog(txHash, QuestionCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    createQuestionLevel3(word1, word2, from_language, to_language, icx_reward) {
        // What's the difference between ... and ... in ... ? 
        // Description: Creates a level 3 question
        // word1: The first word
        // word2: The second word
        // from_language: The iso_639-1 code language of the "from" word
        // to_language: The iso_639-1 code language of the "to" word
        // icx_reward: Amount of ICX sent as a reward for the question
        // returns: The newly created question UID
        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'create_question_level3',
            IconConverter.toHex(this._ancilia.convertUnitToDecimals(icx_reward, 18)),
            {
                'data': JSON.stringify({ "word1": word1, "word2": word2 }),
                'from_language': from_language,
                'to_language': to_language
            }
        ).then(async tx => {
            const txHash = tx['result']
            const eventLog = await this._ancilia.getEventLog(txHash, QuestionCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    createQuestionLevel4(data, from_language, to_language, icx_reward) {
        // Show me an example (from ... in ...)
        // Description: Creates a level 4 question
        // data: The question data (format: word or sentence, no character limit)
        // from_language: The iso_639-1 code language of the "from" word
        // to_language: The iso_639-1 code language of the "to" word
        // icx_reward: Amount of ICX sent as a reward for the question
        // returns: The newly created question UID
        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'create_question_level4',
            IconConverter.toHex(this._ancilia.convertUnitToDecimals(icx_reward, 18)),
            {
                'data': data,
                'from_language': from_language,
                'to_language': to_language
            }
        ).then(async tx => {
            const txHash = tx['result']
            const eventLog = await this._ancilia.getEventLog(txHash, QuestionCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    createQuestionLevel5(data, from_language, to_language, icx_reward) {
        // Ask me anything (from ... in ...)
        // Description: Creates a level 5 question
        // data: The question data (format: word or sentence, no character limit)
        // from_language: The iso_639-1 code language of the "from" word
        // to_language: The iso_639-1 code language of the "to" word
        // icx_reward: Amount of ICX sent as a reward for the question
        // returns: The newly created question UID
        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'create_question_level5',
            IconConverter.toHex(this._ancilia.convertUnitToDecimals(icx_reward, 18)),
            {
                'data': data,
                'from_language': from_language,
                'to_language': to_language
            }
        ).then(async tx => {
            const txHash = tx['result']
            const eventLog = await this._ancilia.getEventLog(txHash, QuestionCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    // -- Question APIs

    answerQuestion(question_uid, data) {
        // Description: Answer to a question (of any level)
        // question_uid: The question UID
        // data: The answer data (format: ? TBD)
        // returns: The newly created answer UID

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'answer_question',
            0,
            {
                'question_uid': question_uid,
                'data': data,
            }
        ).then(async tx => {
            const txHash = tx['result']
            const eventLog = await this._ancilia.getEventLog(txHash, AnswerCreatedEvent)
            return parseInt(eventLog['indexed'][1], 16)
        })
    }

    selectAnswer(answer_uid) {
        // Description: Select the answer as a valid answer for its associated question
        //              The reward (if any) will be sent to the user who posted this answer
        // answer_uid: The answer UID
        // returns: None

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'select_answer',
            0,
            {
                'answer_uid': answer_uid
            }
        )
    }

    cancelQuestion(question_uid) {
        // Description: Cancel a question (of any level), only works for the Question OP
        //              The reward should be refunded to OP if there is any
        //              It only works if there is no answer to the question
        // question_uid: The question UID
        // returns: None

        const wallet = this._ancilia.getLoggedInWallet()

        return this._ancilia.__iconexCallRWTx(
            wallet,
            this._scoreAddress,
            'cancel_question',
            0,
            {
                'question_uid': question_uid
            }
        )
    }
}