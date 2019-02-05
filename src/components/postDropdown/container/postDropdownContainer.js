import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Alert, Share } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { injectIntl } from 'react-intl';

// Services and Actions
import { reblog } from '../../../providers/steem/dsteem';
import { addBookmark } from '../../../providers/esteem/esteem';

// Constants
import OPTIONS from '../../../constants/options/post';
import { default as ROUTES } from '../../../constants/routeNames';

// Utilities
import { writeToClipboard } from '../../../utils/clipboard';
import { getPostUrl } from '../../../utils/post';

// Component
import PostDropdownView from '../view/postDropdownView';

/*
 *            Props Name        Description                                     Value
 *@props -->  props name here   description here                                Value Type Here
 *
 */

class PostDropdownContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Component Life Cycle Functions
  componentWillUnmount = () => {
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
      this.alertTimer = 0;
    }

    if (this.shareTimer) {
      clearTimeout(this.shareTimer);
      this.shareTimer = 0;
    }

    if (this.actionSheetTimer) {
      clearTimeout(this.actionSheetTimer);
      this.actionSheetTimer = 0;
    }
  };

  // Component Functions
  _handleOnDropdownSelect = async (index) => {
    const { content, intl } = this.props;

    switch (index) {
      case '0':
        await writeToClipboard(getPostUrl(content.url));
        this.alertTimer = setTimeout(() => {
          Alert.alert(
            intl.formatMessage({
              id: 'alert.copied',
            }),
          );
          this.alertTimer = 0;
        }, 300);
        break;

      case '1':
        this.actionSheetTimer = setTimeout(() => {
          this.ActionSheet.show();
          this.actionSheetTimer = 0;
        }, 100);
        break;

      case '2':
        this._replyNavigation();
        break;
      case '3':
        this.shareTimer = setTimeout(() => {
          this._share();
          this.shareTimer = 0;
        }, 500);
        break;

      case '4':
        this._addToBookmarks();
        break;

      default:
        break;
    }
  };

  _share = () => {
    const { content } = this.props;
    const postUrl = getPostUrl(content.url);

    Share.share({
      message: `${content.title} ${postUrl}`,
    });
  };

  _addToBookmarks = () => {
    const { currentAccount, content, intl } = this.props;
    addBookmark(currentAccount.name, content.author, content.permlink)
      .then(() => {
        Alert.alert(intl.formatMessage({ id: 'bookmarks.added' }));
      })
      .catch(() => {
        Alert.alert(intl.formatMessage({ id: 'alert.fail' }));
      });
  };

  _reblog = () => {
    const {
      currentAccount, content, isLoggedIn, pinCode, intl,
    } = this.props;
    if (isLoggedIn) {
      reblog(currentAccount, pinCode, content.author, content.permlink)
        .then(() => {
          Alert.alert(
            intl.formatMessage({
              id: 'alert.success',
            }),
            intl.formatMessage({
              id: 'alert.success_rebloged',
            }),
          );
        })
        .catch((error) => {
          if (error.jse_shortmsg && String(error.jse_shortmsg).indexOf('has already reblogged')) {
            Alert.alert(
              intl.formatMessage({
                id: 'alert.already_rebloged',
              }),
            );
          } else {
            Alert.alert(
              intl.formatMessage({
                id: 'alert.fail',
              }),
            );
          }
        });
    }
  };

  _replyNavigation = () => {
    const {
      navigation, content, isLoggedIn, fetchPost,
    } = this.props;

    if (isLoggedIn) {
      navigation.navigate({
        routeName: ROUTES.SCREENS.EDITOR,
        params: {
          isReply: true,
          post: content,
          fetchPost,
        },
      });
    }
  };

  render() {
    const { intl, currentAccount, content } = this.props;
    let _OPTIONS = OPTIONS;

    if (content && content.author === currentAccount.name) {
      _OPTIONS = OPTIONS.filter(item => item !== 'reblog');
    }

    return (
      <Fragment>
        <PostDropdownView
          options={_OPTIONS.map(item => intl.formatMessage({ id: `post_dropdown.${item}` }).toUpperCase())}
          handleOnDropdownSelect={this._handleOnDropdownSelect}
          {...this.props}
        />
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          options={['Reblog', intl.formatMessage({ id: 'alert.cancel' })]}
          title={intl.formatMessage({ id: 'post.reblog_alert' })}
          cancelButtonIndex={1}
          onPress={(index) => {
            index === 0 ? this._reblog() : null;
          }}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.application.isLoggedIn,
  currentAccount: state.account.currentAccount,
  pinCode: state.account.pin,
});

export default withNavigation(connect(mapStateToProps)(injectIntl(PostDropdownContainer)));
