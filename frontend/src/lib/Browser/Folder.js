import FolderTemplate from './Templates/Folder.html';

import FolderItem from './FolderItem.js';
import ImageItem from './ImageItem.js';

export default class Folder extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);


        this.label = 'FOLDER';
        this.options = options;

        this.urlFolderBase = this.app.urlFolderBase;
        this.urlImageBase = this.app.urlImageBase;
        this.urlMediaBase = this.app.urlMediaBase;

        this.includes = {
            images: ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'PNG']
        }

        // fetch the entry url when the app is ready
        this.app.on('ready', () => this.parent.getLocationHash());

        // fetch the specified folder on a hash change
        this.parent.on('hashchange', () => this.get());

        // elevate event
        this.on('data', data => {
            this.parent.emit('data', data);
            this.draw(data);
        });

    }

    get() {
        // @TODO - stop all loading ressources
        if (this.target) {
            this.filesElement.querySelectorAll('picture').forEach(pic => {
                pic.srcset = false;
                pic.querySelector('img').src = '';
                pic.remove();
            });
            this.items = [];
        }

        let urlPath = this.parent.locationExtracted.join('/');

        // @TODO bug some folders where detected as file with extension....
        // @TODO mache einen call auf ein und diesele url
        const extension = (this.parent.locationExtracted[this.parent.locationExtracted.length - 1].match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];

        let url;

        if (!extension) { // if it is no file
            if (!urlPath) { // if it is the root path
                url = `${this.urlFolderBase}`;
            } else {
                url = `${this.urlFolderBase}/${urlPath}`;
            }
        } else { // if a extension exists, it is a file
            if (this.includes.images.includes(extension)) {
                url = `${this.urlImageBase}/${urlPath}`;
            }
        }

        this
            .fetch(url)
            .then(data => this.emit('data', data));
    }

    draw(data) {
        const file = data.file;

        // draw this folder, if it is no file
        !file ? this.drawFolder(data) : null;

        // draw this image
        file ? file.type === 'image' ? this.drawImage(data) : null : null;
    }


    drawFolder(data) {
        this.remove();

        this.target = this.toDOM(FolderTemplate({
            scope: {}
        }));
        this.parent.target.append(this.target);

        //
        this.foldersElement = this.target.querySelector('[data-folders]');
        this.filesElement = this.target.querySelector('[data-files]');

        const folders = data.data.childs.filter(c => c.type === 'folder');
        const images = data.data.childs.filter(c => c.type === 'image');

        console.log(this.label, 'FOLDERS', folders.length);
        console.log(this.label, 'FILES', images.length);

        // first the folders
        this.folders = [];
        if (folders.length > 0)
            folders.forEach(folderData => {
                const folderItem = new FolderItem(this, folderData);
                this.items.push(folderItem);
                this.folders.push(folderItem);
            });

        // second the files
        this.images = [];
        if (images.length > 0)
            images.forEach(fileData => {
                const imageItem = new ImageItem(this, fileData);
                this.items.push(imageItem);
                this.images.push(imageItem);
            });
    }

    drawImage(data) {
    }


    remove() {
        this.target ? this.target.remove() : null;
    }
}
