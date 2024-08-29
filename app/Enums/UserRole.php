<?php

namespace App\Enums;

enum UserRole
{
    case Admin;
    case User;

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::User => 'User',
        };
    }

    public function value(): string
    {
        return match ($this) {
            self::Admin => 'admin',
            self::User => 'user',
        };
    }
}
