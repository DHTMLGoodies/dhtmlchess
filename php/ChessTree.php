<?php

class ChessTree {

    private $items = array();
    private $branches = array();

    public function addItems($items){
        $this->parseItems($items);
    }

    private function parseItems($items){
        foreach($items as $item){
            if(isset($item['parent'])){
                $p = $item['parent'];
                $this->addChildTo($item, $this->branches[$p['id'].$p['type']]);
            }else{
                $this->addChildTo($item, $this->items);
            }
        }
    }

    private function addChildTo($item, &$branch){
        $obj = array(
            'id' => $item['id'],
            'title' => $item['title'],
            'type' => $item['type'],
            'children' => array()
        );
        $branch[] = &$obj;

        $this->branches[$item['id'].$item['type']] = &$obj['children'];
    }

    public function getTree() {
        return $this->items;
    }

}