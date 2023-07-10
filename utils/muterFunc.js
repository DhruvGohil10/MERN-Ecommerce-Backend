import multer from "multer"
import path from 'path'
import fs from 'fs'
export const multerFunction = (dest) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(fs.existsSync(dest)){
                cb(null, dest)
            }else{
                fs.mkdirSync(dest)
                cb(null, dest)
            }
        },
        filename: function (req, file, cb) {
            console.log(file)
            const ext = path.extname(file.originalname)
            const fileArr = file.originalname.split('.')
            fileArr.pop();

            const newfilename = fileArr.join('.') + '-' + Date.now() + ext;
            cb(null, newfilename)
        }
    })

    return multer({ storage: storage })
}