const config = require('../lib/config');

const ISSUES_LIST = config('TRELLO_ISSUES_LISTID');
const DONE_LIST = config('TRELLO_DONE_LISTID');
const FEEDBACK_ACCOUNT = config('TRELLO_FEEDBACK_ACCOUNT');

module.exports.toCedarCard = function toCedarCard(card) {
    var newCard = {};
    newCard.name = card.name;
    newCard.id = card.id;
    newCard.class = 'card-default';
    if (card.labels.length > 0) {
        switch(card.labels[0].color) {
            case 'green':
                newCard.class = 'card-production';
                break;

            case 'yellow':
                newCard.class = 'card-design';
                break;

            case 'orange':
                newCard.class = 'card-tech';
                break;
        }
    }

    var tempDate = new Date(card.dateLastActivity);
    newCard.dateLastActivity = card.dateLastActivity;
    var userFrom = -1;

    //Process to find user / email
    for (var i = 0; i < card.desc.length; ++i) {
        //Determine break line user-info
        if (card.desc[i] == '\n') {
            newCard.description = card.desc.substr(i + 1, card.desc.length - i);
            break;
        }

        //Determine full-name
        if (card.desc[i] == '(') userFrom = i + 1;
        if (card.desc[i] == ')') { newCard.user = card.desc.substr(userFrom, i - userFrom); }
        if (!newCard.user) { newCard.user = 'Thợ săn bí ẩn'; }

        //Determine email
        if (card.desc[i] == '@') {
            var emailFrom, emailTo;
            for (emailFrom = i; emailFrom >= 0; --emailFrom) {
                if (card.desc[emailFrom - 1] == ' ') { break; }
            }
            for (emailTo = i; emailTo < card.desc.length; ++emailTo) {
                if (card.desc[emailTo + 1] == ' ' || card.desc[emailTo + 1] == '\n') { break; }
            }
            newCard.email = card.desc.substr(emailFrom, emailTo - emailFrom + 1);
        }
    }

    //Status of card
    if (card.idList == ISSUES_LIST) { newCard.status = 'wait'; }
    else if (card.idList == DONE_LIST) { newCard.status = 'done'; }
    else { newCard.status = 'process'; }

    return newCard;
};

module.exports.toCedarComment = function toCedarComment(comment) {
    var newComment = {};

    if (comment.type == 'commentCard') {
        newComment.content = comment.data.text;
        if (comment.idMemberCreator == FEEDBACK_ACCOUNT)
        {
            var userFrom = -1;
            for (var i = 0; i < comment.data.text.length; ++i) {
                //Determine break line user-info
                if (comment.data.text[i] == '\n') {
                    newComment.content = comment.data.text.substr(i + 1, comment.data.text.length - i);
                    break;
                }

                //Determine full-name
                if (comment.data.text[i] == '(') userFrom = i + 1;
                if (comment.data.text[i] == ')') {
                    newComment.user = comment.data.text.substr(userFrom, i - userFrom);
                }
                if (!newComment.user) { newComment.user = 'Thợ săn bí ẩn'; }

                //Determine email
                if (comment.data.text[i] == '@') {
                    var emailFrom, emailTo;
                    for (emailFrom = i; emailFrom >= 0; --emailFrom) {
                        if (comment.data.text[emailFrom - 1] == ' ') { break; }
                    }
                    for (emailTo = i; emailTo < comment.data.text.length; ++emailTo) {
                        if (comment.data.text[emailTo + 1] == ' ' || comment.data.text[emailTo + 1] == '\n') { break; }
                    }
                    newComment.email = comment.data.text.substr(emailFrom, emailTo - emailFrom + 1);
                }
            }
            newComment.type = 'feedback';
        }
        else {
            newComment.email = null;
            newComment.user = 'TOXBadge';
            newComment.type = 'reply';
        }
    } else if (comment.type == 'updateCard') {
        if (comment.data.listAfter.id == DONE_LIST) {
            newComment.content = 'TOXBadge đã xử lí xong phản hồi này.';
            newComment.type = 'done';
        }
        else if (comment.data.listAfter.id != ISSUES_LIST) {
            newComment.content = 'TOXBadge đang tiến hành xử lí phản hồi này.';
            newComment.type = 'processing';
        } else return null;
    } else return null;

    newComment.id = comment.id;
    var tempDate = new Date(comment.date);
    newComment.date = tempDate.getDate() + '–' + (tempDate.getMonth() + 1) + '–' + tempDate.getFullYear() +  ' lúc ' + tempDate.getHours() + ':' + tempDate.getMinutes();
    return newComment;
};
