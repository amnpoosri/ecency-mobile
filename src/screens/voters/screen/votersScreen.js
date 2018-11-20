import React, { Component } from 'react';
import { View } from 'react-native';
// Constants

// Components
import { BasicHeader } from '../../../components/basicHeader';
import { FilterBar } from '../../../components/filterBar';
import { VotersDisplay } from '../../../components/votersDisplay';

// Utils
import { isBefore } from '../../../utils/time';

class VotersScreen extends Component {
  /* Props
    * ------------------------------------------------
    *   @prop { type }    name                - Description....
    */

  constructor(props) {
    super(props);
    this.state = {
      data: props.votes,
      filterResult: null,
    };
  }

  // Component Life Cycles

  // Component Functions
  _handleOnDropdownSelect = (index) => {
    const { data } = this.state;
    const _data = data;

    switch (index) {
      case '0':
        _data.sort((a, b) => Number(b.value) - Number(a.value));
        break;
      case '1':
        _data.sort((a, b) => b.percent - a.percent);
        break;
      case '2':
        _data.sort((a, b) => (isBefore(a.time, b.time) ? 1 : -1));
        break;
      default:
        break;
    }

    this.setState({ filterResult: _data });
  };

  _handleRightIconPress = () => {};

  _handleSearch = (text) => {
    const { data } = this.state;

    const newData = data.filter((item) => {
      const itemName = item.voter.toUpperCase();
      const _text = text.toUpperCase();

      return itemName.indexOf(_text) > -1;
    });

    this.setState({ filterResult: newData });
  };

  render() {
    const { data, filterResult } = this.state;
    const headerTitle = `Voters Info (${data && data.length})`;

    return (
      <View>
        <BasicHeader
          title={headerTitle}
          rightIconName="ios-search"
          isHasSearch
          handleOnSearch={this._handleSearch}
        />
        <FilterBar
          dropdownIconName="md-arrow-dropdown"
          options={['REWARDS', 'PERCENT', 'TIME']}
          defaultText="REWARDS"
          onDropdownSelect={this._handleOnDropdownSelect}
        />
        <VotersDisplay key={Math.random()} votes={filterResult || data} />
      </View>
    );
  }
}

export default VotersScreen;
