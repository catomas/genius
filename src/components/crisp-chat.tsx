"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("2f3a8451-f1a1-42d5-902e-4ea617a4a539");
  }, []);

  return null;
};

export default CrispChat;
