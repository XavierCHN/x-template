export const IcToolsConfig =
{
    //Css Merge Config
    CssMerge:
    {
        //First Line Comment Name
        RootCommentName:"IcFileName",

        //Output Folder Name,Based on the path `content/panorama/styles`
        OutCssFolderName:"ic_css",

        //Clean up the directory, if you turn it off it won't do the cleanup, which will result in junk files when changing names
        ClearDir:true,
    },
    //Image Compile
    ImageCompile:
    {
        //need compile of folder, Based on `content\panorama\images` path
        Folders:[
            "custom_game/test",
        ]
    },
}
