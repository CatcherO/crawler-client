import React from 'react'
import { Cascader, Button, Progress, Checkbox } from 'element-react/next'
import { provinces } from './cityJson'
import Avatar from './avatar.jpg'
import 'element-theme-default/lib/cascader.css'
import 'element-theme-default/lib/button.css'
import 'element-theme-default/lib/icon.css'
import 'element-theme-default/lib/progress.css'
import 'element-theme-default/lib/checkbox.css'
import './input.css'

const path = window.require('path')
const { ipcRenderer, shell } = window.require('electron')
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
            percentage: 100,
            loading: false,
            Search: true,
            Get: true,
            statusTexts: []
        };
    }

    componentDidMount() {
        const { value } = JSON.parse(localStorage.getItem('lastConfig')) || { value: [] }
        this.setState({ value })
    }

    handleOnClick(e) {
        // 未选择城市 返回
        if (!this.state.value[0]) {
            return
        }

        this.setState({ loading: true, percentage: 0 })

        ipcRenderer.send('sendSearchMsg', {
            province: this.state.value[0],
            city: this.state.value[1],
            Search: this.state.Search,
            Get: this.state.Get
        })


        ipcRenderer.on('sendSearchFeedBack', (e, percentage) => {
            if (percentage === 100) {
                this.setState({ percentage, loading: false })
            } else {
                this.setState({ percentage })
            }
        })

        ipcRenderer.on('sendStatusFeedBack', (e, data) => {
            let statusTexts = this.state.statusTexts
            statusTexts.unshift(data)
            this.setState({ statusTexts: statusTexts })
        })
        localStorage.setItem('lastConfig', JSON.stringify({ value: this.state.value }))
    }
    handleOpenFile(e) {
        // shell.openExternal(`file://${path.join(__dirname,'../public/data')}`)
        console.log(e.target)
        ipcRenderer.send('sendOpenFile', 'open')
    }
    handleChange(v) {
        this.setState({ value: v })
    }
    handleCheckChange1(v) {
        console.log(v)
        this.setState({ Search: v })
    }
    handleCheckChange2(v) {
        console.log(v)
        this.setState({ Get: v })
    }

    render() {
        return (
            <div className="input-header">
                <div className="circle-avatar" >
                    <img src={Avatar} className='avatar' />
                    <Progress type="circle"
                        percentage={this.state.percentage}
                        showText={false}
                        strokeWidth={2}
                        status="success"
                    />
                </div>

                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <Cascader
                        disabled={this.state.loading}
                        props={this.state.props}
                        options={this.state.options}
                        size='small'
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                    />
                    <Button
                        style={{ marginTop: '10px' }}
                        icon="search"
                        size="small"
                        type="primary"
                        disabled={this.state.loading}
                        loading={this.state.loading}
                        onClick={this.handleOnClick.bind(this)}
                    >
                    </Button>
                </div>
                <div>
                    <Checkbox checked={this.state.Search} onChange={this.handleCheckChange1.bind(this)}>搜索数据</Checkbox>
                    <Checkbox checked={this.state.Get} onChange={this.handleCheckChange2.bind(this)}>获取数据</Checkbox>

                </div>
                <div className="textBox">
                    <i className="el-icon-document open-file"
                        onClick={this.handleOpenFile.bind(this)}
                    >
                        打开储存文件夹
                    </i>
                    <pre>{this.state.statusTexts.join('\n')}</pre>
                </div>

            </div>
        )
    }
}
