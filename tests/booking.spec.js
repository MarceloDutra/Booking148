// Bibliotecas e frameworks importados
import { expect, test } from "@playwright/test";
import { request } from "node:http";

// Variáveis visíveis pelo arquivo todo
let bookingid;
// let token;

// Funções úteis (nenhuma nesse caso)

// Testes
test.describe.serial("Testes do Booking", async () => {
  test("Login com sucesso", async ({ request }) => {
    const user = { username: "admin", password: "password123" };

    const response = await request.post(
      "https://restful-booker.herokuapp.com/auth",
      { data: user },
    );

    // Validação do status code igual 200
    expect(response.status()).toEqual(200);
    const responseBody = await response.json();
    expect(responseBody.token).toBeDefined();
    process.env.TOKEN = responseBody.token;
    console.log(`Token: ${process.env.TOKEN}`);
  }); // Fecha o bloco do teste do Login

  test("Realizar agendamento com sucesso", async ({ request }) => {
    // Arrange (Prepara)
    const booking = {
      firstname: "Marcelo",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      bookingdates: { checkin: "2026-09-30", checkout: "2026-10-03" },
      additionalneeds: "Breakfast, Dinner",
    };

    // Act (Ação)
    const response = await request.post(
      "https://restful-booker.herokuapp.com/booking",
      { data: booking },
    );

    // Assert (Validação)
    expect(response.status()).toEqual(200);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.booking.firstname).toEqual("Marcelo");
    expect(responseBody.booking.bookingdates.checkin).toEqual("2026-09-30");
    expect(responseBody.bookingid).toBeDefined(); // Valida se o campo bookingid existe/foi retornado
    bookingid = responseBody.bookingid; // Guarda o bookingid na variável externa
    console.log("Booking ID no final do POST: " + bookingid);
  }); // Fecha o bloco do teste do POST Booking

  test("Consultar agendamento com sucesso", async ({ request }) => {
    // Arrange
    // const bookingid = 21; Vai vir de uma variável de ambiente
    console.log("Booking ID no GET:" + bookingid);

    // Act
    const response = await request.get(
      `https://restful-booker.herokuapp.com/booking/${bookingid}`,
    );
    // const response = await request.get('https://restful-booker.herokuapp.com/booking/' + bookingid)

    // Assert
    expect(response.status()).toEqual(200);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.firstname).toEqual("Marcelo");
    expect(responseBody.bookingdates.checkin).toEqual("2026-09-30");
  }); // Fecha o bloco do teste do GET Booking

  test("Alterar agendamento com sucesso", async ({ request }) => {
    // Arrange (Prepara)
    const booking = {
      firstname: "Marcelo",
      lastname: "Brown",
      totalprice: 99,
      depositpaid: true,
      bookingdates: { checkin: "2026-10-07", checkout: "2026-10-09" },
      additionalneeds: "Breakfast",
    };

    // Act (Agir/Ação)
    const response = await request.put(
      `https://restful-booker.herokuapp.com/booking/${bookingid}`,
      { headers: { Cookie: "token=" + process.env.TOKEN }, data: booking },
    );

    // Assert
    expect(response.status()).toEqual(200);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.firstname).toEqual("Marcelo");
    expect(responseBody.totalprice).toEqual(99);
    expect(responseBody.bookingdates.checkin).toEqual("2026-10-07");
    expect(responseBody.bookingdates.checkout).toEqual("2026-10-09");
    expect(responseBody.additionalneeds).toEqual("Breakfast");
  });

  test("Alteração parcial com sucesso", async ({ request }) => {
    // Arrange (Preparar)
    const booking = { lastname: "Smith", depositpaid: false };

    // Act (Ação)
    const response = await request.patch(
      `https://restful-booker.herokuapp.com/booking/${bookingid}`,
      {
        headers: { Cookie: "token=" + process.env.TOKEN },
        data: booking,
      },
    );
   
    // Assert
    expect(response.status()).toEqual(200);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody.firstname).toEqual('Marcelo');
    expect(responseBody.lastname).toEqual('Smith')
    expect(responseBody.totalprice).toEqual(99);
    expect(responseBody.depositpaid).toEqual(false)
    expect(responseBody.bookingdates.checkin).toEqual('2026-10-07');
    expect(responseBody.bookingdates.checkout).toEqual('2026-10-09');
    expect(responseBody.additionalneeds).toEqual('Breakfast');
  }); // Fecha o teste PATCH
test('Excluir agendamento com sucesso', async ({ request }) => {
    // Act (Ação)
    const response = await request.delete(
      `https://restful-booker.herokuapp.com/booking/${bookingid}`,
      {
        headers: { Cookie: 'token=' + process.env.TOKEN },
      }
    );
 
    // Assert (Validação)
    expect(response.status()).toEqual(201)
  })