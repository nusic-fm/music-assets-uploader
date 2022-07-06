export default {};
// const getOrFetchAudioStem = ({
//   song,
//   stemKind,
//   stemURL,
// }: {
//   song: Song;
//   stemKind: StemKind;
//   stemURL: string;
// }): Promise<{ kind: StemKind; audio: AudioData; audioBuffer: AudioBuffer }> => {
//   const audioCache = await window.caches.open("audio-cache");
//   const leftKey = `/Float32Buffer/${song.youtubeID}/${stemKind}/left`;
//   const rightKey = `/Float32Buffer/${song.youtubeID}/${stemKind}/right`;
//   const cachedLeft = await audioCache!.match(leftKey);
//   const cachedRight = await audioCache!.match(rightKey);
//   if (cachedLeft && cachedRight) {
//     const promises = [cachedLeft.arrayBuffer(), cachedRight.arrayBuffer()];
//     const [leftChannel, rightChannel] = await Promise.all(promises);
//     const leftFloat32Array = new Float32Array(leftChannel);
//     const rightFloat32Array = new Float32Array(rightChannel);
//     const audioBuffer = ToneAudioBuffer.fromArray([
//       leftFloat32Array,
//       rightFloat32Array,
//     ]).get() as AudioBuffer;

//     return {
//       kind: stemKind,
//       audio: {
//         left: leftFloat32Array,
//         right: rightFloat32Array,
//       },
//       audioBuffer,
//     };
//   } else {
//     const tonePlayer: Tone.Player = await new Promise((resolve) => {
//       const tonePlayer = new Tone.Player(stemURL, () => {
//         resolve(tonePlayer);
//       });
//     });
//     const audioBuffer = tonePlayer.buffer.get() as AudioBuffer;
//     const leftChannelData = audioBuffer.getChannelData(0);
//     const rightChannelData = audioBuffer.getChannelData(1);

//     const leftResponse = new Response(leftChannelData.buffer, {
//       // @ts-ignore
//       headers: {
//         "Content-Type": "ArrayBuffer",
//         "Content-Length": leftChannelData.length,
//       },
//     });
//     const rightResponse = new Response(rightChannelData.buffer, {
//       // @ts-ignore
//       headers: {
//         "Content-Type": "ArrayBuffer",
//         "Content-Length": rightChannelData.length,
//       },
//     });

//     await audioCache!.put(new Request(leftKey), leftResponse);
//     await audioCache!.put(new Request(rightKey), rightResponse);

//     return {
//       kind: stemKind,
//       audio: { left: leftChannelData, right: rightChannelData },
//       audioBuffer,
//     };
//   }
// }
