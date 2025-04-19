# REACT-PANORAMA二维码模块

## 使用方法
请参阅 [hud/scripts.tsx](https://github.com/XavierCHN/x-template/blob/master/content/panorama/src/hud/script.tsx#L21-L38)中的使用方法

```tsx
<PanoramaQRCode
    value={`https://github.com/XavierCHN/x-template`}
    size={128}
    excavate={8}
    style={{
        horizontalAlign: `right`,
        verticalAlign: `bottom`,
        marginBottom: `400px`,
        marginRight: `100px`,
        backgroundColor: `#ffffff`,
        opacity: `0.6`,
    }}
>
    <Image
        src="file://{images}/logos/dota_logo_bright.psd"
        style={{ width: `32px`, height: `32px`, horizontalAlign: `center`, verticalAlign: `center` }}
    />
</PanoramaQRCode>
```

## 相关参数

除了value外，其他所有参数均为可选参数

| 参数 | 类型 | 说明 | 默认值 |
|------|:---:|-----|------|
|value|string, string[]|需要在二维码中显示的内容| |
|size|number|二维码的大小，以像素为单位|128|
|level|ErrorCorrectionLevel|二维码的容错等级|'L'|
|fgColor|string|二维码的前景色，背景色是透明的，你需要自己为容器增加一个背景色|'#000000'|
|marginSize|number|四周边距的大小，以格子数为单位，默认为1|1|
|minVerson|number|编码QR Code时使用的最小版本。有效值为1-40，值越高，QR Code越复杂。|1|
|boostLevel|boolean|如果启用，结果的错误纠正级别可能高于指定的错误纠正级别选项|true|
|excavate|number|二维码中间需要空出的格子数大小（用于避让放进去的logo）以格子数为单位|0|


