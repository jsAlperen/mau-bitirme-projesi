/*--------------------------------------------------
    BMI Calculator
---------------------------------------------------*/
function calculateBMI(){
    var weight = document.bmiCalc.weight.value
    var height = document.bmiCalc.height.value
    
    if(weight > 0 && height > 0){
        var finalBmi = (weight/(height*height))*703;
        document.bmiCalc.bmi.value = new Number(finalBmi).toFixed(2)
        
        if(finalBmi < 18.5){
            document.bmiCalc.meaning.value = "Düşük kilolu"
        }
        
        if(finalBmi > 18.5 && finalBmi < 25){
            document.bmiCalc.meaning.value = "Normal Kilolu"
        }
        
        if(finalBmi > 25 && finalBmi < 30){
            document.bmiCalc.meaning.value = "Fazla Kilolu"
        }
        
        if(finalBmi > 30 && finalBmi < 35){
            document.bmiCalc.meaning.value = "Obezite"
        }
        
        if(finalBmi > 35){
            document.bmiCalc.meaning.value = "Ultra obezite"
        }
        
    }else{
        alert ("Bütün bilgileri giriniz.")
    }
}