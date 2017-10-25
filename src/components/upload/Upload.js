import React, {Component, PropTypes} from 'react';
import styles from './Upload.less';
import {copyText} from '../../utils';
import smms from 'smms';
import {
    Button,
    message,
    Icon,
    Spin,
} from 'antd';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            loading: false,
        };
    }

    filesCount = 0;

    handleChange = (files) => {
        if (files.length > 0) {
            this.filesCount = files.length;
            this.setState({loading: true});
            for (let i = 0; i < files.length; i++) {
                (function (component, file, index, len) {
                    smms(file).then(({data}) => {
                        file.url = data.url;
                        file.hash = data.hash;
                        component.state.files.push(file);
                        console.log(component.filesCount);
                        component.filesCount--;
                        component.setState({
                            loading: component.filesCount > 0,
                        });
                    }).catch(err => {
                        message.error(err.message);
                        component.setState({
                            loading: index < len,
                        });
                    });

                })(this, files[i], i + 1, files.length);
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
                <img title={file.title} src={file.url} alt={file.name}/>
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

    render() {
        const {accept, multiple} = this.props,
            {files, loading} = this.state;
        return (
            <Spin tip="图片上传中..." spinning={loading}>
                <div className={styles.container}>
                    <Button onClick={() => this.input.click()}>
                        <input onChange={e => this.handleChange(e.target.files)}
                               ref={ref => this.input = ref}
                               className={styles.input}
                               accept={accept}
                               multiple={multiple}
                               type="file"/>
                        <Icon type="upload"/> upload
                    </Button>
                    {files.length > 0 ? (
                        <div className={styles.files}>
                            {files.map((file, index) => this.renderFile(file, index))}
                        </div>
                    ) : null}
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
