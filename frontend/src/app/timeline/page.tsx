"use client"

import { isLeft } from 'fp-ts/lib/Either';
import styles from './page.module.css'
import { redirect } from 'next/navigation';

import { useActionState, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
async function  postAction(message:string, formData:FormData): Promise<string>  {
  const formMessage = formData.get("message");
  if (formMessage === null ){
    console.log("error");
    return message;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("error");
    return message;
  }

  console.log("formMessage: ", formMessage);
  console.log("token: ", token);

  const json = JSON.stringify({content: formMessage});
  const URL = "http://localhost:3001/message";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: json,
  };
   const response = await fetch(URL, requestOptions)

   if (response.status === 401) {
    redirect( "/login");
   }

   const data = await response.json()
  console.log(data);


  if (response.status !== 200) {
    console.log("error");
    return message;
  }

  return ""
}




export default  function Timeline() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [posts, setPosts] = useState<{id: string, userId: string, content: string, createdAt: Date}[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  if (!username) {
    redirect("/login");
  }

    const [formData, dispatch] = useActionState(postAction, "")

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedToken) {
      setToken(storedToken);
    }

    const URL = "http://localhost:3001";
   const socket = io(URL);

   if (socket.connected) {
    onConnect();
   }

    function onConnect() {
      setIsConnected(true);
      const transportName = socket.io.engine.transport.name;
      setTransport(transportName);
      console.log(transportName)

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    socket.on("disconnect", onDisconnect);
    socket.on("timelineListener", (posts) => {
      if (isLeft(posts)){
        console.log("Error: ", posts);
      }

      setPosts(posts.right);
    });

    return () => {
      if (socket.connected) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className={styles.posts}>
    <a href={'/login'}>ログイン</a>
    <a href={'/logout'}>ログアウト</a>
      <h1>{username}'s タイムライン</h1>
      <form className={styles.form} action={dispatch}>
          <input type="text" id="message" name="message" className={styles.input} required />
          <br />
          <button type="submit">送信</button>
      </form>
    <div>
      <ul>
      {posts.toReversed().map((post: any) =>
        <li key={post.id} >
          <h2 >@{post.user.username} in {new Date(post.createdAt).toLocaleString()}</h2>
          <p >{post.content}</p>
          </li>
      )}
      </ul>
    </div>
    </div>
  )
}
