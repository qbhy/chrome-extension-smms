import React, {Component} from 'react';
import {connect} from 'dva';
import styles from './IndexPage.css';
import Upload from '../components/upload/Upload';

class IndexPage extends Component {

    render() {
        return (
            <div className={styles.container}>
                <Upload accept="image/png,image/jpg,image/gif" multiple={true}/>
            </div>
        );
    }
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
