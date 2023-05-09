import { Component } from "react";
import styles from "./chat_manager.module.css";
import {message_sender_type, message_type} from "./users_metadata";
import MessageBubble from "./message_bubble";


class Message{
    constructor(message_id, sender_name, sender_type, content){
        this.message_id = message_id;
        this.sender_name = sender_name;
        this.sender_type = sender_type;
        this.content = content;
    }
}


class chat_manager extends Component{
    messages = [
        {
            message_id: "message_0",
            sender_name: "Rumble",
            sender_type: message_sender_type.second_person,
            content: "Hi my name is Rumble. \nI am an A.I virtual assistant trained to provide answers/solutions to your questions. I am still under development so some of my answers may not be 100% accurate. \n\nHow may I be of assistance? For example, You can ask me what the botanical name of an apple is!"
        }
    ];

    state = {
        messages_count: 1,
        chatGPT_is_processing_task: false
    }
    
    render(){
        const all_message_bubbles = this.messages.map((item, pos) => {
            return (
                <MessageBubble key={item.message_id} sender_name={item.sender_name} sender_type={item.sender_type} message={item.content} message_type={message_type.complete_response}/>
            );
        });

        return (
            <div>
                <section className={styles.chat_box_section}>
                    <h3>Chat With Rumble A.I Virtual Assistant</h3>
                    <div className={styles.chat_box_inner_container}>
                        <div id="messages_displayer" className={styles.chat_box_inner_wrapper}>
                            {all_message_bubbles}
                            {this.state.chatGPT_is_processing_task? <MessageBubble key="is_typing_msg" sender_name="Rumble" sender_type={message_sender_type.second_person} message="is typing..." message_type={message_type.is_typing}/> : null}
                        </div>
                    </div>
                </section>
                <section className={styles.message_input_section}>
                    <form id="message_form">
                        <textarea id="message_input_element" maxLength={200} placeholder="Hi Rumble." required></textarea>
                        <button className="button-1">Send <i className="fa-solid fa-paper-plane"></i></button>
                    </form>
                </section>
            </div>
        );
    }

    /*---- Chat Functions ---- */
    append_new_message(message_object){
        if(typeof(message_object) === "object"){
            console.log("Adding new message to message list");
            
            const new_message = {
                message_id: message_object.message_id,
                sender_name: message_object.sender_name,
                sender_type: message_object.sender_type,
                content: message_object.content
            }

            this.messages.push(new_message);//add to the messages array
            // console.log(this.messages);
            this.setState({messages_count: this.messages.length});//update the state property so that the component can be re-rendered
        }
        else{
            console.log(new Error("Error [attempted adding a new message]: The message-object parameter given is not a Message Object"));
        }
    }

    remove_message(index){
        if(typeof(index) === "number" && index < this.messages.length){
            this.messages.splice(index,1);//remove message from messages array
            this.setState({messages_count: this.messages.length});//update the state property so that the component can be re-rendered
        }
        else{
            console.log(new Error("Error [attempted removing a message]: Either the passed message index is not a number or the index is invalid"))
        }
    }
    
    /*---- Communication to chatGPT ---- */
    message_input_element = null;
    messages_displayer = null;
    message_input_form = null;

    componentDidMount(){
        this.messages_displayer = document.getElementById("messages_displayer");
        this.messages_displayer.scrollTo(0,this.messages_displayer.scrollHeight);//pin the scroll bar of the message displayer at the bottom so as to show the new message first wothout having to scroll down
        // window.scrollTo(0,document.body.scrollHeight);

        this.message_input_element = document.getElementById("message_input_element");
        this.message_input_form = document.getElementById("message_form");
        this.message_input_form.addEventListener("submit", (e) => {
            e.preventDefault();

            const new_message = new Message(`message_${this.messages.length}`, 'User', message_sender_type.first_person, this.message_input_element.value);
            this.send_message_to_chatGPT(new_message);//communicate with chat GPT
            this.append_new_message(new_message);//append message to the chat displayer

            this.message_input_element.value = "";//clear the text in the message input element
        });
    }

    componentDidUpdate(){
        if(this.messages_displayer !== null){
            this.messages_displayer.scrollTo(0,this.messages_displayer.scrollHeight);//pin the scroll bar of the message displayer at the bottom so as to show the new message first wothout having to scroll down
        }
    }

    send_message_to_chatGPT(message_object){
        const parent_class = this;
        let chat_history_cutoff = 2;//this tells how many messages the A.I should remember in the chat

        if(typeof(message_object) === "object" && message_object.sender_type === message_sender_type.first_person){
            console.log("About to send message to GPT-4");

            //creating the message array to put in the payload
            let messagesToChatGPT = [
                {"role": "system", "content": "You are a helpful assistant called Rumble or Rumble A.I. You can only respond with text and not with other message formats like images or audio."}
            ]

            const prev_messages = this.messages.length > 2 ? this.messages.filter((item, pos)=>{//if the messages array contains messages more than the 1st default message and the first user message, get the last 2 or so messages for the A.I to remember
                if(pos === this.messages.length - chat_history_cutoff){
                    chat_history_cutoff--;
                    return true;
                }

                return false;
            }) : [];

            if(prev_messages.length > 0){//if there are previous messages to remember, add it to the "messagesToChatGPT" array before we add the new message
                messagesToChatGPT = messagesToChatGPT.concat(prev_messages.map((message) => {
                    const role_type = message.sender_type === message_sender_type.first_person? "user" : "assistant";

                    return {"role": role_type, "content": message.content}
                }));
            }

            messagesToChatGPT.push({"role": "user", "content": message_object.content});//now push the new message in the "messagesToChatGPT" array

            //SENDING TO CHAT-GPT
            const promiseForChatRequest  = new Promise((resolve, reject) => {
                const OPEN_API_KEY = "";//INSERT KEY (NOTE!!: don't leave communication with Open AI public like this. Rather handle communication with OpenAI from a backend)

                const chatRequest = new XMLHttpRequest();

                chatRequest.onreadystatechange = function() {
                    if(this.readyState === 1){
                        //message sent and is being processed by ChatGPT. Show is_typing message in the chat box to show that GPT is responding
                        setTimeout(()=>{
                            parent_class.setState({chatGPT_is_processing_task: true});
                        },600);
                    }
                    else if(this.readyState === 4){//if we have gotten a feedback from chatGPT (either positive or negative)
                        parent_class.setState({chatGPT_is_processing_task: false});//ChatGPT is done processing the task. Remove the message bubble showing "is typing..."

                        let responseInJSON = {};

                        //try converting the response to JSON object
                        try{
                            responseInJSON = JSON.parse(this.responseText);
                        }
                        catch(ex){
                            console.log(new Error(`Error parsing chatGPT response: ${ex.message}`));
                        }

                        if(responseInJSON.error && responseInJSON.error.message){//if the chatGPT responded back with error, show the error
                            reject(`chatGPT responded with error: ${responseInJSON.error.message}`);
                        }
                        else if(responseInJSON.choices && responseInJSON.choices[0].message.content){//if these properties exist in the response, then we have a successful response from chatGPT
                            resolve(responseInJSON.choices[0].message.content);
                        }
                    }
                }

                chatRequest.open("POST", "https://api.openai.com/v1/chat/completions");
                chatRequest.setRequestHeader('Content-Type', 'application/json');
                chatRequest.setRequestHeader('Authorization', `Bearer ${OPEN_API_KEY}`);

                const chatPayload = {
                    "model": "gpt-3.5-turbo",
                    "messages": messagesToChatGPT
                }

                // console.log(chatPayload);

                chatRequest.send(JSON.stringify(chatPayload));
            });

            promiseForChatRequest.then(
                (chatGPTResponse)=>{
                    const new_message = new Message(`message_${this.messages.length}`,"Rumble", message_sender_type.second_person, chatGPTResponse);
                    this.append_new_message(new_message);
                }
            ).catch(
                (error_message) =>{
                    console.log(new Error(error_message));
                }
            );
        }
        else{
            console.log(new Error("Error [attempted sending chat to ChatGPT]; Either the message object parameter given is not an Object or the 'sender-type' property of the message object is not a 'first-person' type"));
        }
    }
}

export default chat_manager;