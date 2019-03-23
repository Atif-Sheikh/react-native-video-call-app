import { Dimensions } from "react-native";
const { fontScale } = Dimensions.get("window");

export default {
    theme: {
        headerBackgroundColor: '#07AFB8',
        buttonBackgroundColor: '#07AFB8',
        buttonTextColor: 'white',
        backgroundColor: "#07AFB8",
        normalColor: "#fff",
        borderColor:"#07AFB8",
        inputBorderColor: "#07AFB8",
        themeColor:"#07AFB8",
        menuTextColor:"grey",
        textColor:"black",
        inputTextColor:"grey",
        bodyTextColor: 'purple',
        headerTextColor: '#fff', // dark grayish blue
        highLighTextColor: '#8d8d8d',
        buttonColor: '#5e656f',
        textboxBackground: '#fff',
        loaderColor: '#5e656f',
        errorTextColor: 'red',
        descriptionTextColor: '#5ca686',
        cardBodyColor: "white",
        gradients: ['#b2c5f7', '#def7f5', '#eaf7f6'],
        gradients2:['#07AFB8','#fff'],
        // gradients: ['red', 'green', 'blue'],
        headingColor:"grey"
    },
    fonts: {
        large: fontScale * 30,
        h1: fontScale * 20,
        h2: fontScale * 18,
        h3: fontScale * 16,
        regular: fontScale * 14,
        medium: fontScale * 12,
        small: fontScale * 10,
        "Normal": "Nunito-Regular",
        "Bold": "Nunito-Bold",
        "Italic": "Nunito-Italic",
        "BoldItalic": "Nunito-BoldItalic",
    }
};