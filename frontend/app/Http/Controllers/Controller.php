<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;

class Controller extends BaseController
{
    public function showIndex() {
        $promise1 = $this->getService1();
        $promise2 = $this->getService2();
        $promise3 = $this->getService3();

        $promises = [$promise1, $promise2, $promise3];

        $results = \GuzzleHttp\Promise\settle($promises)->wait();

        return response()->json([
            'service1' => [
                'value' => $results[0]['value']->value,
                'ip' => $results[0]['value']->ip,
            ],
            'service2' => [
                'value' => $results[1]['value']->value,
                'ip' => $results[1]['value']->ip,
            ],
            'service3' => [
                'value' => $results[2]['value']->value,
                'ip' => $results[2]['value']->ip,
            ],
        ]);
    }

    private function getService1() {
        $host = $_ENV['SERVICE1_HOST'];
        $url = "http://{$host}";

        return $this->callService($url);
    }

    private function getService2() {
        $host = $_ENV['SERVICE2_HOST'];
        $url = "http://{$host}";

        return $this->callService($url);
    }

    private function getService3() {
        $host = $_ENV['SERVICE3_HOST'];
        $url = "http://{$host}";

        return $this->callService($url);
    }

    private function callService($url) {
        $client = new \GuzzleHttp\Client();
        $promise = $client->getAsync($url)->then(function($response) {
            return json_decode($response->getBody());
        });

        return $promise;
    }
}
