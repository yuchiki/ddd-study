"use client";
import { useActionState } from "react";
import { redirect } from "next/navigation";

type FormState = {
  username: string;
  password: string;
}

 async function  postAction(formState:FormState, formData:FormData): Promise<FormState>  {
  const newFormState = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  }
  console.log(newFormState);

  const json = JSON.stringify(newFormState);
  const URL = "http://localhost:3001/login";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  };
   const response = await fetch(URL, requestOptions)
   if (response.status !== 200) {
    console.log("error");
    return newFormState;
  }

   const data = await response.json()
  console.log(data);



  const token = data.token;

  localStorage.setItem("token", token);
  localStorage.setItem("username", newFormState.username);

  redirect("/timeline");
}


export default function Login() {
  const URL = "http://localhost:3001";
  const [formData, dispatch] =
    useActionState(
      postAction,
      {
        username: "",
        password: "",
      }
    )

  return (
    <div className="signup">
      <a href="signup">新規アカウント作成</a>
      <h1>ログイン</h1>
      <form action={dispatch}>
        <div>
          <label htmlFor="username">ユーザーネーム</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}
