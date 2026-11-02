const accomodation = document.querySelector(".accomodation")
const booking = document.querySelector(".main-form")

const book_buttons = document.querySelectorAll(".reserve-btn")



book_buttons.forEach( button =>{
    button.addEventListener("click", ()=>{
        accomodation.classList.add("hide")
        booking.classList.remove("hide")
    })
})


/* *********** ALL BOOKING INPUT ELEMENTS ************ */


const full_name_input = document.querySelector(".full-name")
const phone_input = document.querySelector(".phone-no")
const email_input = document.querySelector(".email-in")
const check_in_input = document.querySelector(".check-in")
const check_out_input = document.querySelector(".check-out")
const room_input = document.querySelector(".room-type")

room_input.addEventListener("change",()=>{

    const check_in_date = new Date(check_in_input.value);
    const start_date = check_in_date.getDate();
    

    const check_out_date = new Date(check_out_input.value);
    const end_date = check_out_date.getDate();
    

    /* ************* CHECK IF MONTHS ARE SAME ****************** */
    const check_in_month = check_in_date.getMonth()
    console.log(check_in_month);
    
    const check_out_month = check_out_date.getMonth()
    console.log(check_out_month);
    
    const nights = document.querySelector(".nights")

    if (check_in_month === check_out_month) {
        const stay_days = end_date - start_date;
        nights.textContent = stay_days
        
    } else {
        const current_month_days = new Date(check_in_date.getFullYear(), check_in_month + 1,0).getDate()
        const this_month_days =(current_month_days - start_date)
        const all_days = this_month_days + end_date
        nights.textContent = all_days
    }
})


const request_booking = document.querySelector(".see-totals")
request_booking.addEventListener("click", ()=>{

    /* ************ CONFERENCE HALL & GYM-DAY PASS ************ */
    const gym_pass_check = document.querySelector(".gym-day-pass")
    const conf_hall_check = document.querySelector(".conf_hall_check")

    let stay_days;


    if( 
        full_name_input.value &&
        phone_input.value && 
        check_in_input.value &&
        check_out_input.value &&
        room_input.value

    ){


        const customer_data = {}
        customer_data.name = full_name_input.value;
        customer_data.phone = phone_input.value;
        customer_data.indate = check_in_input.value;
         customer_data.outdate = check_out_input.value;
        

            let gym_price;
            let hall_price;

            /* *************** Find Room Price ********************* */
            const room_price = Number(room_input.value)
        
        
            /* ************ ADD GYM & HALL ***************** */
            if (gym_pass_check.checked) {
                gym_price = Number(gym_pass_check.parentElement.querySelector(".gym-price").textContent)
                customer_data.gym = "yes"
            } else {
                gym_price = 0
            }

            if(conf_hall_check.checked){
                hall_price = Number(conf_hall_check.parentElement.querySelector(".hall-price").textContent)
                customer_data.hall = "yes"     
            } else {
                hall_price = 0
            }


            /* ****************** TOTALS ************************** */
            stay_days =Number(document.querySelector(".nights").textContent)

            const room_total = (room_price*stay_days)
            const gym_price_total = gym_price*stay_days
            const hall_price_total = hall_price*stay_days

            const total_cost = room_total + gym_price_total + hall_price_total


            /*  ************* DISPLAY TOTALS ON PAGE ***************** */
            const roomTotal = document.querySelector(".room-total")
            const gymTotal = document.querySelector(".gym-total")
            const confTotal = document.querySelector(".conf-total")
            const total = document.querySelector(".total")

            roomTotal.textContent = room_total
            gymTotal.textContent = gym_price_total
            confTotal.textContent = hall_price_total
            total.textContent = total_cost

            console.log(customer_data);

            localStorage.clear()

            localStorage.setItem("customerData", JSON.stringify(customer_data));
            
            
            
    } else {

        const error_display = document.querySelector(".error")
        error_display.textContent = "Please Enter All The Required Info - Fields with *"  
        
        setTimeout( ()=>{
            error_display.textContent = ""
        }, 3000)
        
    }
    
    
})


/* ************ SEND WHATSAPP MESSAGE ****************** */
const send_btn = document.querySelector(".send-message")
send_btn.addEventListener("click", ()=>{

    const customerData = JSON.parse(localStorage.getItem("customerData")) || {}
    console.log(customerData);


    const week_days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    /* ***************** Get Check in & Check Out Days ****************** */
    const start = new Date(customerData.indate)
    const startday_name = week_days[start.getDay()];
    const startDate = start.getDate();

    const end = new Date(customerData.outdate)
    const endday_name = week_days[end.getDay()];
    const endDate = end.getDate();
    
    

    const my_number = "+254712345678"

    let plain_message = `
    Hello my name is ${customerData.name}. I want a room from ${startday_name} ${startDate} to
    ${endday_name} ${endDate}.`

    if (customerData.gym === "yes") {
        plain_message += " Gym included. "
    } else {
        plain_message += " No gym included. "
    }

    if (customerData.hall === "yes") {
        plain_message += "Conference hall included. "
    } else {
        plain_message += "I dont need a conference hall."
    }

    const encoded_message = encodeURIComponent(plain_message)
    const url = `whatsapp://send?phone=${my_number}&text=${encoded_message}`
    window.location.href = url
    
})