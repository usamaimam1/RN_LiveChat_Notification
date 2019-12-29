import React from 'react'
import { Text, View, Platform, Dimensions, StyleSheet, Image, StatusBar,ImageBackground } from 'react-native'
import {
    Content, Container, Header, Footer, Left, Body, Right,
    Icon, ListItem
} from 'native-base'
export default class SideBar extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {

    }
    render() {
        console.log(this.props)
        return (
            <Container>
                <Content>
                    <ImageBackground
                        source={{
                            uri: "https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                        }}
                        style={{
                            height: 150,
                            alignSelf: "stretch",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <Image
                            square
                            style={{ height: 100, width: 100,borderRadius:50 }}
                            source={this.props.imgSrc}
                        />
                    </ImageBackground>
                </Content>
            </Container>
        )
    }
}