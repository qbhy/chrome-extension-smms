import React, {Component, PropTypes} from 'react';
import styles from './Upload.less';
import {copyText} from '../../utils';
import smms from 'smms';
import store from 'store';
import {
    Button,
    message,
    Icon,
    Spin,
    Modal,
    Alert,
} from 'antd';

const FILES = 'smms_files';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: store.get(FILES) || [],
            loading: false,
            preview: {
                show: false,
                url: '',
            },
        };
    }

    filesCount = 0;

    preview(url) {
        if (url) {
            return this.setState({preview: {url, show: true}});
        }
        this.setState({preview: {url: this.state.preview.url, show: false}});
    }

    componentDidMount() {
        console.log(store);
        console.log(store.get);
        console.log(store.get(FILES));
    }

    handleChange = (files) => {
        if (files.length > 0) {
            this.filesCount = files.length;
            this.setState({loading: true});
            for (let i = 0; i < files.length; i++) {
                ((file, index, len) => {
                    smms(file).then(({data}) => {
                        this.state.files.push({
                            url: data.url,
                            hash: data.hash,
                            name: file.name,
                        });
                        this.filesCount--;
                        if (this.filesCount <= 0) {
                            store.remove(FILES);
                            store.set(FILES, this.state.files);
                        }
                        this.setState({loading: this.filesCount > 0});
                    }).catch(err => {
                        message.error(err.message);
                    });

                })(files[i], i + 1, files.length);
            }
        }
    };

    copy = (value) => {
        copyText(value);
        message.success('复制成功!');
    };

    renderFile = (file, index) => {
        return (
            <div key={index} className={styles.item}>
                <img onClick={() => this.preview(file.url)}
                     title={file.title}
                     src={file.url}
                     alt={file.name}/>
                <div className={styles.actions}>
                    <a onClick={() => this.copy(file.url)} href="javascript:;">复制URL</a>
                    <a onClick={() => this.copy(`<img src="${file.url}"/>`)} href="javascript:;">复制 html</a>
                    <a className={styles.closeable}
                       onClick={() => this.handleRemove(index)}
                       href="javascript:;">
                        <Icon type="close"/>
                    </a>
                </div>
            </div>
        );
    };

    handleRemove(index) {
        this.setState({loading: true});
        smms.remove(this.state.files[index].hash).then(() => {
            this.state.files.splice(index, 1);
            this.setState({loading: false});
        })
    }

    removeAll() {
        const {files} = this.state;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                smms.remove(files[i].hash);
            }
        }
        this.reset();
    }

    reset() {
        store.remove(FILES);
        this.setState({files: []});
    }

    render() {
        const {accept, multiple} = this.props,
            {files, loading, preview} = this.state;
        return (
            <Spin tip="图片上传中..." spinning={loading}>
                <div className={styles.container}>
                    <Modal
                        style={{top: 10}}
                        footer={null}
                        visible={preview.show}
                        onCancel={() => this.preview(false)}
                        title="预览">
                        <div className={styles.preview}>
                            <img src={preview.url} alt={preview.url}/>
                        </div>
                    </Modal>
                    <Button onClick={() => this.input.click()}>
                        <input onChange={e => this.handleChange(e.target.files)}
                               ref={ref => this.input = ref}
                               className={styles.input}
                               accept={accept}
                               multiple={multiple}
                               type="file"/>
                        <Icon type="upload"/> upload
                    </Button>
                    <Button onClick={() => this.removeAll()}>
                        删除所有
                    </Button>
                    <Button onClick={() => this.reset()}>
                        重置
                    </Button>
                    {files.length > 0 ? (
                        <div className={styles.files}>
                            {files.map((file, index) => this.renderFile(file, index))}
                        </div>
                    ) : (
                        <div className={styles.files}>
                            <Alert
                                message="您还没有上传图片"
                                description="你可以点击上面的 upload 来上传图片。 不用的图片请点击删除，避免浪费空间, 谢谢配合。删除所有 按钮会从空间里删除列表的图片，若不想删除 CDN 里的文件请点击 重置列表。"
                                type="info"
                            />
                        </div>
                    )}
                </div>
            </Spin>
        );
    }
}

Upload.propTypes = {
    accept: PropTypes.string,
    multiple: PropTypes.bool,
};

export default Upload;
