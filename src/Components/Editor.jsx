// import React, { useEffect, useRef } from 'react'
// import Codemirror from 'codemirror';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/material-darker.css';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';


// const Editor = () => {
  
//   useEffect(()=>{
//     async function init(){ 
//        Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
//         mode:{name:'javascript',json:true},
//         theme:'material-darker',
//         autoCloseTags:true,
//         autoCloseBrackets:true,
//         lineNumbers:true,
//       })
//     }
//     init()
//   },[])

//   return (<div>
//      <textarea id='realtimeEditor' style={{height:'100vh'}}></textarea>
//   </div>
   
//   )
  
// }

// export default Editor


import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/icecoder.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions.js';

const Editor = ({socketRef,roomid,onChangeCode}) => {
  const editorContainerRef = useRef(null);
  // const textareaRef = useRef(null)
  // const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {


    if (!socketRef?.current) {
      console.error('Socket reference is not available');
      return;
    }



    // First, ensure any existing CodeMirror instance is fully removed
    const existingCM = editorContainerRef.current?.querySelector('.CodeMirror');
    if (existingCM) {
      existingCM.remove();
    }

    // Create fresh textarea
    const textarea = document.createElement('textarea');
    textarea.id = 'realtimeEditor';
    
    // Clear container and add fresh textarea
    if (editorContainerRef.current) {
      editorContainerRef.current.innerHTML = '';
      editorContainerRef.current.appendChild(textarea);
    }

    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(textarea, {
      mode: { name: 'javascript', json: true },
      theme: 'icecoder',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true
    });

    const handleChange = (instance,changes)=>{
      const {origin} = changes;
      const code = instance.getValue()
      onChangeCode(code);

      if(origin !== 'setvalue'){
        console.log("emitting code change",{roomid,code})

        socketRef.current.emit(ACTIONS.CODE_CHANGE,{
          roomid,
          code
        });

        

      }
    };
    
    editor.on('change',handleChange);
    
    // editor.on('change',(instance,changes)=>{
    //   console.log('changes',changes)
    //   const {origin} = changes
    //   const code = instance.getValue()
    //   if(origin !== 'setvalue'){
    //     console.log("working")
    //     socketRef.current.emit(ACTIONS.CODE_CHANGE,()=>{
    //       roomid,
    //       code
    //     })
    //   }
    // })

    socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
      if(code!==null){
        editor.off('change',handleChange);
        editor.setValue(code);
        editor.on('change',handleChange)
       
      }

    });

    // Force a refresh to ensure proper rendering
    editor.refresh();
   

    return () => {
      if (editor) {
        editor.off('change', handleChange);
        socketRef.current?.off(ACTIONS.CODE_CHANGE,);
        editor.toTextArea();
        if (editorContainerRef.current) {
          editorContainerRef.current.innerHTML = '';
        }
      }
    };
    
  }, [socketRef,roomid]); // Empty dependency array for single initialization

 

  return (
    <div 
      ref={editorContainerRef} 
      className="editor-container" 
      style={{
        width: '1135px',
        height: '100vh'  
      }}
    />
  );
};

export default Editor;


// import React, { useEffect, useRef, useState } from 'react';
// import CodeMirror from 'codemirror';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/icecoder.css';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import ACTIONS from '../Actions.js';

// const Editor = ({socketRef, roomid}) => {
//   const textareaRef = useRef(null);
//   const editorRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Ensure all dependencies are available
//     if (!socketRef?.current || !textareaRef.current) {
//       console.error('Socket or textarea reference is not available');
//       return;
//     }

//     // Initialize CodeMirror only once
//     if (!editorRef.current) {
//       editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
//         mode: { name: 'javascript', json: true },
//         theme: 'icecoder',
//         autoCloseTags: true,
//         autoCloseBrackets: true,
//         lineNumbers: true
//       });

//       const handleChange = (instance, changes) => {
//         const {origin} = changes;
//         const code = instance.getValue();

//         if(origin !== 'setvalue'){
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomid,
//             code
//           });
//         }
//       };

//       editorRef.current.on('change', handleChange);
      
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
//         if(code !== null){
//           editorRef.current.off('change', handleChange);
//           editorRef.current.setValue(code);
//           editorRef.current.on('change', handleChange);
//         }
//       });

//       setIsLoading(false);
//     }

//     // Cleanup function
//     return () => {
//       if (editorRef.current) {
//         editorRef.current.off('change');
//         socketRef.current?.off(ACTIONS.CODE_CHANGE);
//         editorRef.current.toTextArea();
//       }
//     };
//   }, [socketRef, roomid]);

//   if(isLoading){
//     return <div>Loading Editor...</div>
//   }

//   return (
//     <div className="editor-container" style={{width: '1100px', height: '100vh'}}>
//       <textarea 
//         ref={textareaRef} 
//         id="realtimeEditor" 
//         style={{display: 'none'}} 
//       />
//     </div>
//   );
// };

// export default Editor;