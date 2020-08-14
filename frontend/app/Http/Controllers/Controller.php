<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController
{
    public function showIndex() {
        return response()->json([
            'service1' => 1,
            'service2' => 2,
            'service3' => 3,
        ]);
    }
}
