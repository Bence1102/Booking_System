<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Mail::extend('sendgrid', function () {
            return \Symfony\Component\Mailer\Transport::fromDsn(
                'sendgrid+api://' . config('services.sendgrid.key') . '@default'
            );
        });
    }
}
