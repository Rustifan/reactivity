export function reduceText(text: string, length: number = 100, addDots: boolean=true)
{
    if(text.length > length)
    {
        const newStr = text.slice(0, length);
        const dots = addDots? "..." : "";
        return newStr+dots;

    }
    return text;
    
}