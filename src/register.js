import React from 'react';
import addons from '@storybook/addons';

const styles = {
    testsPanel: {
        margin: 10,
        fontFamily: 'Arail',
        fontSize: 14,
        color: '#444',
        width: '100%',
        overflow: 'auto',
    },
};

export class Karma extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = { test: '' };
        this.onAddTests = this.onAddTests.bind(this);
    }

    componentDidMount() {
        const { channel, api } = this.props;
        channel.on('storybook/karma/add_tests', this.onAddTests);
        this.stopListeningOnStory = api.onStory(() => {
            this.onAddTests('');
        });
    }

    // cleanup
    componentWillUnmount() {
        if (this.stopListeningOnStory) {
            this.stopListeningOnStory();
        }

        this.unmounted = true;
        const { channel } = this.props;
        channel.removeListener('storybook/karma/add_tests', this.onAddTests);
    }

    onAddTests(test) {
        this.setState({ test });
    }

    render() {
        const { test } = this.state;
        const textAfterFormatted = test ? test.trim().replace(/n/g, '<br />') : '';

        return <div style={ styles.testsPanel }>
            <div dangerouslySetInnerHTML={{ __html: textAfterFormatted }} />
        </div>
    }
}

Karma.defaultProps = {
    channel: {},
    api: {},
};

// register the addon
addons.register('storybook/karma', api => {
    addons.addPanel('storbook/karma/panel', {
        title: 'Karma',
        render: () => <Karma channel={ addons.getChannel() } api={api} />,
    });
});