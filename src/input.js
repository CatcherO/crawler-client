import React from 'react'
import { Cascader, Button, Progress } from 'element-react/next'
import { provinces } from './cityJson'
import 'element-theme-default/lib/cascader.css'
import 'element-theme-default/lib/button.css'
import 'element-theme-default/lib/icon.css'
import 'element-theme-default/lib/progress.css'
import './input.css'

const { ipcRenderer } = window.require('electron')
export default class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options2: provinces,
            props: {
                value: 'name',
                label: 'name',
                children: 'city'
            },
            value: ['江苏省', '南京市'],
            precentage: 0
        };
    }

    handleOnClink(v){
        ipcRenderer.send('sendMsg', this.state.value)
        
    }

    handleChange (v) {
        console.log(v)
        this.setState({value: v})
    }

    render() {
        return (
            <div className="input-header">
                <div className="input-button" onClick={this.handleOnClink.bind(this)}>
                    <Progress type="circle"
                    percentage={this.state.precentage}
                    textInside={false}
                     />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Cascader
                        props={this.state.props}
                        options={this.state.options2}
                        size='small'
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>

            </div>
        )
    }
}
