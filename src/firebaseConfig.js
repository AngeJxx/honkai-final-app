import { initializeApp } from "firebase/app";
// 注意：这里我们不再需要导出 db 和 auth，因为App.js内部已经处理了
const firebaseConfig = {
  apiKey: "AIzaSyBjQYBgvvhC7xUyCNH0P0dUK_Lj8qjkE0U",
  authDomain: "honkai-sr-helper-4fbd1.firebaseapp.com",
  projectId: "honkai-sr-helper",
  storageBucket: "honkai-sr-helper.appspot.com",
  messagingSenderId: "766114723569",
  appId: "1:766114723569:web:e2c78a83d4a151caba9b50"
};
const app = initializeApp(firebaseConfig);
export default app; // 导出app实例
