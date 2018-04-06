import React from 'react';
import addons from '@storybook/addons';
import { EHOSTUNREACH } from 'constants';

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
        this.state = {
            tests: '',
            karmaResults: {},
        };
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

    onAddTests(options) {
        this.setState({ 
            tests: (options.tests) ? options.tests : '',
            karmaResults: (options.karmaResults) ? options.karmaResults : {},
        });
    }

    render() {
        const { tests, karmaResults } = this.state;
        let results = [];

        console.log('rendering, for science!');

        // filter out results
        if (karmaResults.browsers) {
            const browserKeys = Object.keys(karmaResults.browsers);
            const browser = (browserKeys) ? browserKeys[0] : '';
            if (browser) {
                results = karmaResults.result[browser]
                    .filter((result) => result.suite.includes(tests));
            }
        }


        return React.createElement('div', { style: styles.testsPanel }, 
            React.createElement('div', {}, [
                React.createElement('h1', { key: 'header'}, tests),
                (
                    (results && results.length > 0)
                        ? React.createElement('ul', { key: 'results' },
                            results.map(function(result) {
                                let color = (result.success) ? 'green' : 'red';
                                return React.createElement('li', { key: result.description, style: { color } }, result.description)
                            })
                        )
                        : React.createElement('p', { key: 'no-results' }, 'no tests found')
                ),
            ])
        )
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
        render: () => React.createElement(Karma, {channel: addons.getChannel(), api}),
    });
});