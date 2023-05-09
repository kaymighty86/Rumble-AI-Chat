import styles from "./message_bubble.module.css";
import {message_sender_type, message_type} from "./users_metadata";
import loading_icon from "./img/loading_icon.gif";

function MessageBubble(props){
    /*Props:
    sender_name: string
    sender_type: string [first_person / second_person]
    message: string
    message_type: string [complete_response / processing]
    */
    return (
        <div>
            <div className={`${styles.message_bubble} ${props.sender_type === message_sender_type.first_person ? styles.message_bubble_1st_person : styles.message_bubble_2nd_person} ${props.message_type === message_type.is_typing? styles.is_typing : ""}`}>
                <h3>{props.sender_name}</h3>
                <p>{props.message}</p>
                {props.message_type === message_type.is_typing? <img src={loading_icon} typeof="image/gif" alt="Loading Icon" width="32px"></img> : null}
                <div className={styles.message_bubble_caret}><i className="fa-solid fa-caret-down"></i></div>
            </div>
        </div>
    );
}

export default MessageBubble;