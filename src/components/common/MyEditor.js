import React from 'react';
// import MUIRichTextEditor from 'mui-rte';
// import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactQuill from 'react-quill';

// const defaultTheme = createMuiTheme();
// Object.assign(defaultTheme, {
//     overrides: {
//         MUIRichTextEditor: {
//             root: {
//                 marginTop: 20,
//                 width: "100%",
//                 border: '1px solid #ccc'
//             },
//             editor: {
//                 borderBottom: "1px solid gray",
//                 padding: '10px'
//             }
//         }
//     }
// })
const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean', 'link', 'image', 'video'],
    ]
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color'
]

const MyEditor = (props) => {
    const { onChange, placeholder, value } = props;

    return (
        // <MuiThemeProvider theme={defaultTheme}>
        //     <MUIRichTextEditor 
        //         onChange={onChange}
        //         value={value}
        //         label={label} />
        // </MuiThemeProvider>
        // <CKEditor
        //     editor={ ClassicEditor }
        //     extraPlugins= "uicolor"
        //     config
        //     data="<p>Hello from CKEditor 5!</p>"
        //     onInit={editor => {
        //         // You can store the "editor" and use when it is needed.
        //         console.log( 'Editor is ready to use!', editor );
                
        //     }}
        //     onChange={( event, editor) => {
        //         const data = editor.getData();
        //         console.log(data);
        //         console.log( { event, editor, data } );
        //     } }
         
        // />

        <ReactQuill 
            value={value}
            placeholder={placeholder}
            onChange={onChange} 
            modules={modules}
            theme="snow" />
    );
};


export default MyEditor;
