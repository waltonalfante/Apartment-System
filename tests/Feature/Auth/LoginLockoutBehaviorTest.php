<?php

use App\Models\User;

it('locks out after repeated failed login attempts', function () {
    $user = User::factory()->create();

    for ($i = 1; $i <= 5; $i++) {
        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
    }

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
