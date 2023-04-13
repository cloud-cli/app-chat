import { ref, unref } from 'vue';

export interface Message {
  role: string;
  content: string
}

const prompt = () => [
  {
    role: 'assistant',
    content: 'Hi! Ask me anything :)',
  },
];


export function useChat() {
  const history = ref(localStorage.history ? JSON.parse(localStorage.history) : prompt());

  async function fetch(question: Message) {
    const messages = unref(history).concat(question);
    const options = {
      method: 'post',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages }),
    };

    return fetch('https://chat.homebots.io/chat', options as any).then((x) => x.json());
  }

  function append(message: Message) {
    const newHistory = history.value = unref(history).concat(newMessage);
    localStorage.history = JSON.stringify(newHistory);
  }

  async function ask(message: string) {
    if (!message.trim()) return;

    const newMessage = { role: 'user', content: message };
    this.append(newMessage);

    const response = await this.ask(message);
    this.append(response);
  }

  return { history, ask };
}