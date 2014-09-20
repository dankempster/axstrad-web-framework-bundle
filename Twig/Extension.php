<?php
namespace Axstrad\WebFrameworkBundle\Twig;

/**
 * Axstrad\WebFrameworkBundle\Twig\Extension
 *
 * Provides the following filters
 *  * capitalise - Capitalises a string using PHP functions: strtolower(), followed by ucwords().
 *  * ucwords    - Uppercase the first character of each word in a string. Unlike capitalise, this filter doesn't lower
 *                 case the word first.
 */
class Extension extends \Twig_Extension
{
    /**
     */
    public function getFilters()
    {
        return array(
            'capitalise' => new \Twig_Filter_Method($this, 'capitalise'),
            'ucwords' => new \Twig_Filter_Function('ucwords'),
        );
    }

    /**
     */
    public function getFunctions()
    {
        return array(
            'wrapsubstr' => new \Twig_Function_Function('Tjs\Common\Util\StrUtil::wrapSubstr'),
        );
    }

    /**
     * Capitalises a string
     *
     * The string is first passed to strtolower then ucwords.
     *
     * @param  string $str The string to capitalise
     * @return string      The capitalised string
     */
    public function capitalise($str){
        return ucwords(strtolower($str));
    }

    /**
     */
    public function getName()
    {
        return 'axstrad_twig_extension';
    }
}
