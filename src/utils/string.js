import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ValidationUtils from './validation';

class StringUtils{
    static truncate(str, length){
        if(str.length <= length) return str;
        return str.substring(0, length) + '...';
    }

    static parseHtml(html){
        return ReactHtmlParser(html);
    }

    static removeHtml(html) {
        // const tmp = document.createElement("div");
        // tmp.innerHTML = html;
        // return tmp.textContent || tmp.innerText || "";
        if(ValidationUtils.isEmpty(html)) return '';
        return html.replace(/<[^>]*>?/gm, '');
    }

    static getObjTitle(obj){
        if(ValidationUtils.isEmpty(obj) || ValidationUtils.isEmpty(obj.title)) return 'Chưa có tiêu đề';
        return obj.title;
    }
}

export default StringUtils;