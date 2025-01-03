import React from 'react';
import { createRoot } from 'react-dom/client';
// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";

import Popup from './Popup';
import './index.css';
import '../../styles/tailwind.css'

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <NextUIProvider>
    <Popup />
  </NextUIProvider>
);