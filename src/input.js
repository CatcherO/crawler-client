import React from 'react'
import { Cascader, Button, Progress } from 'element-react/next'
import { provinces } from './cityJson'
import Avatar from './avatar.jpg'
import 'element-theme-default/lib/cascader.css'
import 'element-theme-default/lib/button.css'
import 'element-theme-default/lib/icon.css'
import 'element-theme-default/lib/progress.css'
import './input.css'

// const { ipcRenderer } = window.require('electron')
export default class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: provinces,
            props: {
                value: 'name',
                label: 'name',
                children: 'city'
            },
            value: ['江苏省', '南京市'],
            precentage: 25,
            loading: false
        };
    }

    handleOnClink(v){
        // ipcRenderer.send('sendMsg', this.state.value)
        console.log('click')
        this.setState({loading: true})
    }

    handleChange (v) {
        console.log(v)
        this.setState({value: v})
    }

    render() {
        return (
            <div className="input-header">
                <div className="circle-avatar" >
                    <img src={Avatar} className='avatar'/>               
                    <Progress type="circle"
                        percentage={this.state.precentage}
                        showText={false}
                        strokeWidth={2}
                        status="success"
                     />
                </div>
                <div style={{ marginTop: '10px'}}>
                    <Cascader
                        disabled={this.state.loading}
                        props={this.state.props}
                        options={this.state.options}
                        size='small'
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                    />
                <Button
                    style={{ marginTop: '10px'}}
                    icon="search"
                    size="small"
                    type="primary"
                    disabled={this.state.loading}
                    loading={this.state.loading}
                    onClick={this.handleOnClink.bind(this)}
                >
                </Button>
                </div>
                
            </div>
        )
    }
}
