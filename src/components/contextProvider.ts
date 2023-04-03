import { createContext } from "react";

const mongoContext = createContext(null)
const stampContext = createContext(null)
const nominContext = createContext(null)

export {mongoContext, stampContext, nominContext}