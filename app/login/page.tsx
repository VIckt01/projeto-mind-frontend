"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// "Porta de entrada" da página login
export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
}