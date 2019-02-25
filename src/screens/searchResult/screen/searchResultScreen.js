import React, { PureComponent, Fragment } from 'react';
import { View } from 'react-native';
import ScrollableTabView from '@esteemapp/react-native-scrollable-tab-view';
import { injectIntl } from 'react-intl';

// Components
import { TabBar } from '../../../components/tabBar';
import { Posts } from '../../../components/posts';
import SearchInput from '../../../components/searchInput';

// Styles
import styles from './searchResultStyles';
import globalStyles from '../../../globalStyles';

class SearchResultScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { intl, tag, navigationGoBack } = this.props;

    return (
      <Fragment>
        <View style={styles.container}>
          <SearchInput
            onChangeText={text => console.log('text :', text)}
            handleOnModalClose={navigationGoBack}
            placeholder={tag}
            editable={false}
          />
          <ScrollableTabView
            style={globalStyles.tabView}
            renderTabBar={() => (
              <TabBar
                style={styles.tabbar}
                tabUnderlineDefaultWidth={80}
                tabUnderlineScaleX={2}
                tabBarPosition="overlayTop"
              />
            )}
          >
            <View
              tabLabel={intl.formatMessage({
                id: 'search.posts',
              })}
              style={styles.tabbarItem}
            >
              <Posts pageType="posts" tag={tag} />
            </View>
            {/* <View
              tabLabel={intl.formatMessage({
                id: 'search.comments',
              })}
              style={styles.tabbarItem}
            >
              <Posts
                filterOptions={POPULAR_FILTERS}
                getFor={POPULAR_FILTERS[0].toLowerCase()}
                selectedOptionIndex={0}
                pageType="posts"
              />
            </Fragment> */}
          </ScrollableTabView>
        </View>
      </Fragment>
    );
  }
}

export default injectIntl(SearchResultScreen);
