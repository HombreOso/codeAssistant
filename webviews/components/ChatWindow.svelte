<script lang='ts'>
    let message: string = '';
    let messages: string[] = [];

    const sendMessage = () => {
        if (message.trim() !== '') {
            messages = [...messages, message];
        }
        message = '';
    };
</script>



<h1>Chat Assistant</h1>
<div id="chatBox">
    {#each messages as msg (msg)}
        <p>{msg}</p>
    {/each}
</div>
<input type="text" bind:value={message} on:keydown={(e) => { if(e.key === 'Enter') sendMessage(); }} />
<button on:click={sendMessage}>Send</button>
