// import React from 'react';
// import ValidationUtils from './../../utils/validation';

// const MyUploadImage = (props) => {
//     const { onChange, image, onSave } = props;

//     return (
//         <>
//             <div className="avatar-container">
//             <label htmlFor="avatar1">Ảnh</label>
//             <div className="avatar-80">
//                 <img
//                     id="avatar1"
//                     name="avatar1"
//                     src={image}
//                     width="80"
//                 />
//             </div>
//         </div>
//         <div className="control">
//             <input
//                 type="file"
//                 name="image"
//                 accept=".jpg, .gif, .png, .jpeg"
//                 onChange={e => onChange(e.target.files[0])}
//             />
//         <p className="tips">JPG, GIF or PNG, Kích thước file tối đâ: 10MB</p>
//         <div className="form-group">
//             <Button
//                 color="primary"
//                 variant="contained"
//                 type="button"
//                 onClick={onSave}
//                 disabled={ValidationUtils.isEmpty(image)}
//             >
//             <CloudUploadIcon />
//                 <span className="pl-2 capitalize">Lưu ảnh</span>
//             </Button>
//         </div>
//     </div>
    
//         </>
//     );
// };


// export default MyUploadImage;
