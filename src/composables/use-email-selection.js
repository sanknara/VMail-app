import { reactive } from "vue";
import axios from 'axios';

let emails = reactive(new Set());
export const useEmailSelection = function () {
    let toggle = function (email) {
        if (emails.has(email)) {
            emails.delete(email);
        } else {
            emails.add(email);
        }
    }

    let clear = () => {
        emails.clear();
    }

    let addMultiple = (newEmails) => {
        newEmails.forEach(email => {
            emails.add(email);
        })
    }

    let forSelected = (fn) => {
        emails.forEach(email => {
            fn(email);
            axios.put(`https://json-server-heroku-sanknara.herokuapp.com/emails/${email.id}`, email);
        })
    }

    let markRead = () => forSelected(e => e.read = true)

    let markUnread = () => forSelected(e => e.read = false)

    let archive = () => { forSelected(e => e.archived = true); clear() }

    let undoArchive = () => { forSelected(e => e.archived = false); clear() }

    return {
        emails,
        toggle,
        clear,
        addMultiple,
        markRead,
        markUnread,
        archive,
        undoArchive
    }
}

export default useEmailSelection;
