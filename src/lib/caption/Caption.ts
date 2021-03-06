import {Util} from "../utilities/Util";
import {prop} from "../others/Enum";
import {PixivJson} from "../others/jsonInterface";
import {ContainerFactory} from "../utilities/ContainerFactory";

export class Caption {

  //  private innerContainer: HTMLElement;
    private captionContainer: HTMLElement
    private descriptionElem: HTMLElement
    private tagElem: HTMLElement
    private infoElem: HTMLElement
    private className: string;
    private pixivJson: PixivJson;

    private captionContainerID: string = 'popup-caption-container'
    private captionDescriptionID: string = 'popup-caption-text'
    private captionTagID: string = 'popup-caption-tag'
    private captionDateID: string = 'popup-caption-date'
    private captionLikeID: string = 'popup-caption-like'
    private captionBookmarkID: string = 'popup-caption-bookmark'
    private captionViewID: string = 'popup-caption-view'
    private captionInfoID: string = 'popup-caption-infomation'
    private likeIcon: string = `<img src="https://s.pximg.net/www/js/spa/260127df5fe9ade778ec4be463deaf01.svg" width="12" height="12">`
    private bookmarkIcon: string = `<svg viewBox="0 0 12 12" width="12" height="12" class="css-1hamw6p e1rs6xf14"><path fill="currentColor" d="
        M9,0.75 C10.6568542,0.75 12,2.09314575 12,3.75 C12,6.68851315 10.0811423,9.22726429 6.24342696,11.3662534
        L6.24342863,11.3662564 C6.09210392,11.4505987 5.90790324,11.4505988 5.75657851,11.3662565
        C1.9188595,9.22726671 0,6.68851455 0,3.75 C1.1324993e-16,2.09314575 1.34314575,0.75 3,0.75
        C4.12649824,0.75 5.33911281,1.60202454 6,2.66822994 C6.66088719,1.60202454 7.87350176,0.75 9,0.75 Z"></path></svg>`
    private viewIcon: string = `<img src="https://s.pximg.net/www/js/spa/af74d092363c09fd06441a4ab04c9331.svg" width="14" height="12">`

    private captionContainerCSS: string =
        `
        white-space:pre-wrap;
        z-index:10001;
        position:relative;
        width:auto;
        height:auto;
        border: 1px solid #000;
        max-width:${window.innerWidth }px;
        max-height:${window.innerHeight}px;
        background-color:white;
        word-wrap:break-word;
       word-break:break-all;
        
       `
    private pixpediaItemCSS: string
        = `.popup-pixpedia-icon{
    display: inline-block;
    margin-left: 2px;
    width: 15px;
    height: 14px;
    vertical-align: -2px;
    text-decoration: none;
    background: url(https://s.pximg.net/www/images/inline/pixpedia.png) no-repeat;
    }
.popup-pixpedia-no-icon{
    display: inline-block;
    margin-left: 2px;
    width: 15px;
    height: 14px;
    vertical-align: -2px;
    text-decoration: none;
     background: url(https://s.pximg.net/www/images/inline/pixpedia-no-item.png) no-repeat;
}
     `
    private descriptionContainerCSS: string
        = `font-size: normal; 
          width: auto; 
          height:auto;
          overflow-y:scroll;`
    private infoContainerCSS = `
        background-color:white;
        font-size:xx-small;
        width: auto;
        color:#999999; 
        line-height=1;`;

    constructor(className: string,) {
        this.captionContainer = new ContainerFactory()
            .setId(this.captionContainerID)
            .setClass(className)
            .setCSS(this.captionContainerCSS)
            .createDiv()
    }

    /**
     * キャプションをポップアップする
     * テキスト、タグ、その他情報(ブックマーク等)を,それぞれelementを用意しコンテナとして箱詰めし、innerContainerに付与する
     * @param innerContainer
     * @param json
     */
    popup() {
        const captionContainer = this.captionContainer
        //const innerContainer = this.innerContainer
        const json = this.pixivJson

        //既存のキャプションコンテナがあれば破棄
        captionContainer.innerText = ''

        //テキストコンテナを作成
        const factory = new ContainerFactory()
        const descriptionElem: HTMLElement = factory.setId(this.captionDescriptionID)
            .setClass(this.className)
            .setCSS(this.descriptionContainerCSS)
            .setInnerHtml(json.body.description)
            .createDiv()
        const tagElem: HTMLElement = factory.setId(this.captionTagID)
            .setClass(this.className)
            .createDiv()
        tagElem.appendChild(this.getTagHtml(json))

        //投稿日
        const date = new Date(json.body.createDate);
        const dateString: string = `upload:${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
        const dateElem: HTMLElement = factory.setId(this.captionDateID).setInnerHtml(dateString).createDiv()


        //like数
        const likeString: string = `${this.likeIcon} ${json.body.likeCount} `
        const likeElem: HTMLElement = factory.setId(this.captionLikeID).setClass(this.className).setInnerHtml(likeString).createSpan()

        //ブックマーク数
        const bookmarkString: string = `${this.bookmarkIcon} ${json.body.bookmarkCount} `
        const bookmarkElem: HTMLElement = factory.setId(this.captionBookmarkID).setClass(this.className).setInnerHtml(bookmarkString).createSpan()

        //閲覧数
        const viewString: string = `${this.viewIcon}${json.body.viewCount}`
        const viewElem: HTMLElement = factory.setId(this.captionViewID).setClass(this.className).setInnerHtml(viewString).createSpan()


        //infoコンテナに各elementを詰める
        const infoElem: HTMLElement = factory
            .setId(this.captionInfoID)
            .setClass(this.className)
            .setCSS(this.infoContainerCSS)
            .createDiv()

        infoElem.appendChild(dateElem)
        infoElem.appendChild(likeElem)
        infoElem.appendChild(bookmarkElem)
        infoElem.appendChild(viewElem)


        //キャプション用コンテナにテキストコンテナとinfoコンテナを詰める
        captionContainer.appendChild(descriptionElem)
        captionContainer.appendChild(tagElem)
        captionContainer.appendChild(infoElem)

        this.descriptionElem = descriptionElem
        this.tagElem = tagElem
        this.infoElem = infoElem
        captionContainer.style.display = 'block'

    }

    /**
     * タグ情報を格納したHTMLelementを作成する
     */
    private getTagHtml(json: PixivJson): HTMLElement {
        let outerTagElem: HTMLElement = document.createElement('ul')
        // @ts-ignore
        outerTagElem.style.paddingInlineStart = '0px'
        //outerTagElem.setAttribute('align','left')

        for (const tagJson of json.body.tags.tags) {
            let iconElem: HTMLElement = document.createElement('a')
            iconElem.className = `${tagJson.romaji || tagJson.locked ? "popup-pixpedia-icon" : "popup-pixpedia-no-icon"}`
            iconElem.setAttribute('href', `https://dic.pixiv.net/a/${tagJson.tag}`)
            let innerTagElem: HTMLElement = document.createElement('li')
            innerTagElem.innerHTML = ` ${tagJson.locked ? "<span>＊<span>" : ""}${tagJson.tag}`
            innerTagElem.style.cssText = 'display: inline-block;'
            innerTagElem.appendChild(iconElem)
            outerTagElem.appendChild(innerTagElem)
        }
        return outerTagElem
    }



    setClassName(className: string) {
        this.className = className
    }

    adjustSize(screen:HTMLElement) {
        this.descriptionElem.style.height = this.descriptionElem.clientHeight > 100 ? `${100}px` : `${this.descriptionElem.clientHeight}px`
        this.captionContainer.style.width = `${screen.offsetWidth}px`
    }

    /**
     * 大きさがあるHTMLelementを引数に、それが画面の中央に表示されるようになるelementのtop・leftの値を返す
     * @param elem
     */

    /*
    getOffset(elem: HTMLElement): { top: number; left: number } {
        const w_height = $(window).height();
        const w_width = $(window).width();
        const el_height = $(elem).height();
        const el_width = $(elem).width();
        const scroll_height = $(window).scrollTop();
        const position_h = scroll_height + (w_height - el_height) / 2;
        const position_w = (w_width - el_width) / 2;
        return {top: Math.round(position_h), left: Math.round(position_w)};
    }
    */
    setJson(pixivJson: PixivJson) {
        this.pixivJson = pixivJson
    }

    setCaptionContainer(captionContainer: HTMLElement) {
        this.captionContainer = captionContainer
    }

    getContainer() {
        return this.captionContainer
    }

    addCSS() {
        //ドキュメントにCSSを登録
        const style = document.createElement('style');
        style.textContent = this.pixpediaItemCSS
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    resetContainer() {
        this.captionContainer = document.getElementById(this.captionContainerID)
        this.captionContainer.innerText=""
    }
}