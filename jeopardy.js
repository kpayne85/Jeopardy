// function preloadMedia({ src, type }) {
//     return new Promise((resolve, reject) => {
//         switch (type) {
//             case 'img':
//                 const img = new Image();
//                 img.src = src;
//                 img.onload = () => resolve(img);
//                 img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
//                 break;
//             case 'audio':
//                 const audio = new Audio(src);
//                 audio.onload = () => resolve(audio);
//                 audio.onerror = () => reject(new Error(`Failed to load image at ${url}`));
//             default:
//         }
//     });
// }

// async function preloadAllMedia(mediaArray) {
//     const promises = mediaArray.map(preloadMedia);
//     try {
//         await Promise.all(promises);
//         console.log("All media preloaded successfully");
//     } catch (error) {
//         console.error("Error preloading media:", error);
//     }
// }

// const mediaToPreload = [
//     { src: "./media/images/host/default.png", type: "img" },
//     { src: "./media/sounds/chat_chime.wav", type: "audio" },
//     { src: "./media/sounds/alert.wav", type: "audio" },
//     { src: "./media/sounds/Player_Buzz.mp3", type: "audio" },
//     { src: "./media/sounds/other_Buzz.wav", type: "audio" },
//     { src: "./media/sounds/wrong.wav", type: "audio" },
//     { src: "./media/sounds/success.mp3", type: "audio" },
// ];

// preloadAllMedia(mediaToPreload);

const app = new gameArea();
