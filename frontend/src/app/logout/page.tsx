"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default async function Logout() {

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    redirect("/");
  }, []);
}
