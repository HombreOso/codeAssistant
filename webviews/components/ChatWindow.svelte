<script lang='ts'>
    import { onMount, afterUpdate } from 'svelte';
    import { format } from 'date-fns';
    import { quintOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';
    import ChatBubble from './ChatBubble.svelte';

    let message: string = '';
    let messages: { text: string, isBot: boolean }[] = [];
    let isTyping: boolean = false;

    const sendMessage = async () => {
        if (isTyping) return;
        if (message.trim() !== '') {
            messages = [...messages, { text: message, isBot: false }];
            let newMsg = message
            message = ''
            isTyping = true;
            const response = await getResponse(newMsg);
            isTyping = false;
            messages = [...messages, { text: response, isBot: true }];
        } else message = '';
    };

    const getResponse = (message: string): Promise<string> => {
        // Placeholder until API is ready
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('fetching response...');
            }, 1000000);
        });
    };

    onMount(() => {
        messages = [
            { text: `Welcome to Code Assistant!\nHow can I assist you today?`, isBot: true },
        ];
    });

    afterUpdate(() => {
        const chatBox = document.getElementById('chatBox');
        if(chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
</script>


<style>
    #chatBox {
        height: 300px;
        border: 1px solid #ccc;
        padding: 10px;
        overflow-y: scroll;
        position: relative;
    }
    .message {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    input {
        width: 70%;
        border-radius: 15px;
        padding: 5px 10px;
        margin-right: 5px;
    }
    button {
        padding: 5px 10px;
        border-radius: 15px;
        border: none;
        background-color: #1E1E1E;
        color: #D4D4D4;
        cursor: pointer;
    }
    button:hover {
        background-color: #0C0C0C;
    }
</style>

<div id="chatBox">
    {#each messages as msg (msg)}
        <div class="message">
            <!-- {#if msg.isBot}
                <img src="/assets/bot-avatar.png" alt="bot avatar" style="height: 30px;">
                {/if} -->
                <ChatBubble text={msg.text} isBot={msg.isBot} isTyping={false} />
            </div>
            {/each}
            <div class="message">
                {#if isTyping}<ChatBubble text='' isBot={true} isTyping={true} />{/if}
            </div>
</div>
<input type="text" bind:value={message} on:keydown={(e) => { if(e.key === 'Enter') sendMessage(); }} />
<button on:click={sendMessage}>Send</button>
