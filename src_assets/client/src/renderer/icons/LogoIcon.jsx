import { SvgIcon } from "@mui/material";
import React, { forwardRef } from "react";

const LogoIcon = forwardRef((props, forwardedRef) => {
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      ref={forwardedRef}
      fontSize="inherit"
      {...props}
    >
      <g clipPath="url(#clip0_101_2)">
        <path
          d="M484 0H28C12.536 0 0 12.536 0 28V484C0 499.464 12.536 512 28 512H484C499.464 512 512 499.464 512 484V28C512 12.536 499.464 0 484 0Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M254.094 397.7V397.722H103.656V348.281H155.44C142.108 330.525 133.832 309.491 131.488 287.411H181.3C184.366 304.402 193.275 319.786 206.485 330.902C219.696 342.018 236.377 348.165 253.642 348.281H254.095V348.291C268.878 348.259 283.314 343.807 295.548 335.507C307.781 327.208 317.253 315.439 322.746 301.714C328.24 287.989 329.503 272.935 326.374 258.487C323.245 244.038 315.866 230.856 305.187 220.633C321.245 214.97 336.231 206.635 349.514 195.981C367.571 218.038 377.416 245.676 377.371 274.181C377.37 342.392 322.179 397.688 254.094 397.7Z"
          fill="#24223C"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M254.722 200.016V200.086C254.506 200.086 254.293 200.066 254.076 200.066C236.736 200.083 219.951 206.187 206.651 217.313C193.351 228.44 184.379 243.882 181.3 260.947H131.488C134.721 230.681 149.027 202.679 171.655 182.322C194.284 161.965 223.638 150.69 254.076 150.665H254.291C269.606 150.615 284.528 145.817 297.001 136.93C309.474 128.044 318.883 115.507 323.932 101.048H374.924C369.317 128.847 354.303 153.866 332.409 171.892C310.516 189.917 283.081 199.849 254.722 200.016Z"
          fill="#B73AFF"
        />
      </g>
      <defs>
        <clipPath id="clip0_101_2">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
});

LogoIcon.displayName = "LogoIcon";

export { LogoIcon };
