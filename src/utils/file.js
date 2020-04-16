class FileUtils{
    static toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })

    static isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image';
    }

    static isOverSize(file, megabyte){
        return !file || file['size']/1024/2014 > megabyte;
    }
}

export default FileUtils;